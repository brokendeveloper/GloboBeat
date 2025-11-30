import os
import sys
import subprocess
import glob


def popular_banco():
    # Caminhos fixos no Docker (garantidos pelo Dockerfile)
    audfprint_script = "/app/audfprint_lib/audfprint.py"
    trilhas_dir = "/app/trilhas_globo"

    # Salva o banco na mesma pasta deste script
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "globo_db.pklz")

    print(f"🚀 Iniciando ingestão (Audfprint)...")
    print(f"   📂 Lendo músicas de: {trilhas_dir}")
    print(f"   💾 Criando banco em: {db_path}")

    # Verifica se a pasta existe (volume montado)
    if not os.path.exists(trilhas_dir):
        print(f"❌ Erro: Pasta {trilhas_dir} não encontrada.")
        print("   Verifique se a pasta 'trilhas_globo' está na raiz do projeto e o volume do Docker está correto.")
        return

    # Encontra arquivos de áudio
    arquivos_mp3 = glob.glob(os.path.join(trilhas_dir, "*.mp3"))
    arquivos_wav = glob.glob(os.path.join(trilhas_dir, "*.wav"))
    todos_arquivos = arquivos_mp3 + arquivos_wav

    if not todos_arquivos:
        print("❌ Nenhum arquivo .mp3 ou .wav encontrado.")
        return

    print(f"   🎵 Processando {len(todos_arquivos)} arquivos...")

    # Comando: python3 /app/audfprint_lib/audfprint.py new --dbase ... --density 20 ...
    cmd = [
              "python3", audfprint_script,
              "new",
              "--dbase", db_path,
              "--density", "20",
              "--ncores", "4"  # Usa 4 cores para ir mais rápido (graças ao joblib/psutil)
          ] + todos_arquivos

    try:
        subprocess.run(cmd, check=True)
        print("\n✅ Banco de dados 'globo_db.pklz' criado com sucesso!")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Erro ao criar banco: {e}")


if __name__ == '__main__':
    popular_banco()