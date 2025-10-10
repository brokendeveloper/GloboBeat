interface CardTrilhaProps{
    nome: string
    album: string
    banda: string
    timestamp: string
    politica: string
    gMusicID: string
}

export default function CardTrilha(props:CardTrilhaProps){
    return(
        <div className="bg-[#055371] !mb-0.5 w-1/4 h-80 !p-5 text-white !text-2xl rounded-md">
            <div><strong>Nome:</strong> {props.nome}</div>
            <div><strong>Albúm:</strong> {props.album}</div>
            <div><strong>Banda:</strong> {props.banda}</div>
            <div><strong>Timestamp:</strong> {props.timestamp}</div>
            <div><strong>Política:</strong> {props.politica}</div>
            <div><strong>G music ID:</strong> {props.gMusicID}</div>
        </div>
    )
}