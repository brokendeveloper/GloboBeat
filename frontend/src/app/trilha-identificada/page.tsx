import PrincipalHeader from "@/components/PrincipalHeader"
import CardTrilha from "@/components/CardTrilha"

export default function TrilhaIdentificada(){

    const trilhas = [
        {
            nome: "Oceano",
            album: "Oceano",
            banda: "Djavan",
            timeStamp: "00:23 - 1:00",
            politica: "(Não encontrada/Restrita/Livre)",
            gMusicID: "XXXXXXXXXX",
            usada: "2"
        },
        {
            nome: "Oceano",
            album: "Oceano",
            banda: "Djavan",
            timeStamp: "00:23 - 1:00",
            politica: "(Não encontrada/Restrita/Livre)",
            gMusicID: "XXXXXXXXXY",
            usada: "2"
        },
        {
            nome: "Oceano",
            album: "Oceano",
            banda: "Djavan",
            timeStamp: "00:23 - 1:00",
            politica: "(Não encontrada/Restrita/Livre)",
            gMusicID: "XXXXXXXXXZ",
            usada: "2"
        }
    ]

    return(
        <div className="min-h-screen bg-white">
            <PrincipalHeader/>
            <main>
                <div className="flex flex-col items-center !mt-4">
                    <h1 className="!text-4xl !mb-4 !font-bold text-[#055371]">Trilha(s) identificadas</h1>
                    {trilhas.map((trilha) => (
                        <CardTrilha 
                            nome={trilha.nome} album={trilha.album} banda={trilha.banda}
                            timestamp={trilha.timeStamp} politica={trilha.politica} gMusicID={trilha.gMusicID}
                            usada={`${trilha.usada} Vezes`} key={trilha.gMusicID}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}