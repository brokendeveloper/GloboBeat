import sys
import os
import json
import asyncio
import concurrent.futures
import re
import subprocess
import acoustid
from pydub import AudioSegment


try:
    from acrcloud.recognizer import ACRCloudRecognizer
except ImportError:
    # Fallback apenas para teste local fora do Docker
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    try:
        from acrcloud_sdk_python.recognizer import ACRCloudRecognizer
    except ImportError:
        print(json.dumps({"error": "ACRCloud SDK not found"}))
        sys.exit(1)

# --- CONFIGURAÇÕES ---
CONFIG = {
    'ACRCLOUD': {
        'host': os.getenv('ACRCLOUD_HOST', 'identify-us-west-2.acrcloud.com'),
        'access_key': os.getenv('ACRCLOUD_ACCESS_KEY', ''),
        'access_secret': os.getenv('ACRCLOUD_ACCESS_SECRET', ''),
        'timeout': 10
    },
    'ACOUSTID': {
        'api_key': os.getenv('ACOUSTID_API_KEY', '')
    },
    'LOCAL_DB': {
        'path': os.path.join(os.path.dirname(os.path.abspath(__file__)), 'globo_db.pklz'),
        'script': '/app/audfprint_lib/audfprint.py',
        'enabled': True
    },
    'SCAN': {
        'intervalo_segundos': 20,
        'duracao_recorte': 15
    }
}


# --- FUNÇÕES AUXILIARES ---
def gerar_chave_unica(artista, titulo):
    if not titulo or not artista: return "desconhecido"
    titulo_limpo = re.sub(r"\(.*?\)|\[.*?\]", "", titulo)
    return f"{artista.strip().lower()}_{titulo_limpo.strip().lower()}"


def obter_duracao_ffprobe(file_path):
    try:
        cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of',
               'default=noprint_wrappers=1:nokey=1', file_path]
        return float(subprocess.run(cmd, capture_output=True, text=True).stdout.strip())
    except:
        return None


def extrair_chunk_temporario(file_path, start_time, duration):
    temp_filename = f"/tmp/chunk_{int(start_time)}_{os.getpid()}.mp3"
    try:
        cmd = [
            'ffmpeg', '-y', '-ss', str(start_time), '-t', str(duration),
            '-i', file_path, '-vn', '-acodec', 'libmp3lame', '-f', 'mp3',
            temp_filename
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return temp_filename
    except:
        return None


# --- WORKERS ---

def run_acrcloud_task(file_path, start_seconds):
    try:
        recognizer = ACRCloudRecognizer(CONFIG['ACRCLOUD'])
        res_str = recognizer.recognize_by_file(file_path, start_seconds=start_seconds)
        return json.loads(res_str)
    except:
        return None


def run_acoustid_task(chunk_path):
    try:
        for score, rid, title, artist in acoustid.match(CONFIG['ACOUSTID']['api_key'], chunk_path):
            if score > 0.6:
                return {"titulo": title, "artista": artist, "score": int(score * 100), "fonte": "AcoustID"}
            break
    except:
        pass
    return None


def run_local_db_task(chunk_path):
    """Nível 3: Banco Local (Audfprint)"""
    db_config = CONFIG['LOCAL_DB']

    if not db_config['enabled'] or not os.path.exists(db_config['path']):
        return None

    try:
        cmd = [
            'python3', db_config['script'],
            'match',
            '--dbase', db_config['path'],
            '--match-win', '1',
            chunk_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        output = result.stdout

        if "Matched" in output:
            # Tenta extrair o nome do arquivo do output do audfprint
            match = re.search(r"Matched .*? as (.*?) at", output)
            if match:
                filename = match.group(1)
                title = os.path.splitext(os.path.basename(filename))[0]
                return {
                    "titulo": title,
                    "artista": "Acervo Globo",
                    "score": 100,
                    "fonte": "Banco Local (Audfprint)"
                }
    except Exception as e:
        sys.stderr.write(f"      ⚠️ Erro Banco Local: {e}\n")
    return None


def processar_trecho_acr(res_acr):
    if res_acr and res_acr.get('status', {}).get('code') == 0:
        if 'music' in res_acr['metadata'] and len(res_acr['metadata']['music']) > 0:
            music = res_acr['metadata']['music'][0]
            if music.get('score', 0) >= 80:
                return {
                    "titulo": music.get('title'),
                    "artista": ", ".join([a['name'] for a in music.get('artists', [])]),
                    "album": music.get('album', {}).get('name'),
                    "score": music.get('score'),
                    "fonte": "ACRCloud"
                }
    return None


# --- MAIN ---

async def main_pipeline():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Argumento arquivo faltando"}))
        return

    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(json.dumps({"error": f"Arquivo nao encontrado: {file_path}"}))
        return

    sys.stderr.write(f"📺 Iniciando Varredura (ACR -> AcoustID -> Audfprint) em: {os.path.basename(file_path)}\n")

    duracao_total = obter_duracao_ffprobe(file_path)
    if not duracao_total: duracao_total = 60

    musicas_encontradas = []
    chaves_unicas = set()
    loop = asyncio.get_running_loop()
    cursor = 0

    while cursor < duracao_total:
        sys.stderr.write(f"   🔍 Janela {cursor}s: ")
        match = None

        # 1. ACRCloud
        with concurrent.futures.ThreadPoolExecutor() as pool:
            res_bruto = await loop.run_in_executor(pool, run_acrcloud_task, file_path, cursor)
        match = processar_trecho_acr(res_bruto)

        if match:
            sys.stderr.write(f"☁️  ACR achou '{match['titulo']}'\n")
        else:
            sys.stderr.write("⚠️  ACR falhou. Fallbacks... ")
            chunk_temp = extrair_chunk_temporario(file_path, cursor, CONFIG['SCAN']['duracao_recorte'])

            if chunk_temp:
                # 2. AcoustID
                with concurrent.futures.ThreadPoolExecutor() as pool:
                    match = await loop.run_in_executor(pool, run_acoustid_task, chunk_temp)

                if match:
                    sys.stderr.write(f"✅ AcoustID achou '{match['titulo']}'\n")
                else:
                    # 3. Audfprint
                    sys.stderr.write("🏠 Audfprint... ")
                    with concurrent.futures.ThreadPoolExecutor() as pool:
                        match = await loop.run_in_executor(pool, run_local_db_task, chunk_temp)

                    if match:
                        sys.stderr.write(f"✅ LOCAL achou '{match['titulo']}'\n")
                    else:
                        sys.stderr.write("❌ Nada.\n")

                if os.path.exists(chunk_temp): os.remove(chunk_temp)

        if match:
            chave = gerar_chave_unica(match['artista'], match['titulo'])
            if chave not in chaves_unicas:
                match['tempo_encontrado'] = f"{int(cursor)}s"
                musicas_encontradas.append(match)
                chaves_unicas.add(chave)

        cursor += CONFIG['SCAN']['intervalo_segundos']

    output = {
        "reconhecido": len(musicas_encontradas) > 0,
        "qtd_musicas": len(musicas_encontradas),
        "trilha_sonora": musicas_encontradas
    }
    print(json.dumps(output, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    asyncio.run(main_pipeline())