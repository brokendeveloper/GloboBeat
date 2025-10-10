import PrincipalHeader from "@/components/PrincipalHeader";
import CardTrilha from "@/components/CardTrilha";
import Image from "next/image";
import { Button } from "@chakra-ui/react";

export default function TrilhaIdentificada() {
  const trilhas = [
    {
      nome: "Oceano",
      album: "Oceano",
      banda: "Djavan",
      timeStamp: "00:23 - 1:00",
      politica: "(Não encontrada/Restrita/Livre)",
      gMusicID: "XXXXXXXXXX",
      
    },
    {
      nome: "Oceano",
      album: "Oceano",
      banda: "Djavan",
      timeStamp: "00:23 - 1:00",
      politica: "(Não encontrada/Restrita/Livre)",
      gMusicID: "XXXXXXXXXY",
      
    },
    {
      nome: "Oceano",
      album: "Oceano",
      banda: "Djavan",
      timeStamp: "00:23 - 1:00",
      politica: "(Não encontrada/Restrita/Livre)",
      gMusicID: "XXXXXXXXXZ",
      
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header normal */}
      <div className="w-full bg-white shadow-md">
        <PrincipalHeader />

        {/* Barra superior */}
        <div className="relative px-6 py-4 text-[#055371]">
          {/* Botão Voltar - canto esquerdo */}
          <div className="absolute top-4 left-6 flex gap-2 items-center text-2xl cursor-pointer">
            <Image src="/voltar.png" alt="Voltar" width={51} height={51} />
            <span>Voltar</span>
          </div>

          {/* Texto e botão - canto direito */}
          <div className="flex flex-col items-center absolute top-20 right-6 text-[#055371] text-center max-w-md gap-10">
            <h1 className="!text-2xl !font-bold">Status: <span className="text-yellow-300">Pendente</span></h1>
            <select
                id="validar"
                name="validar"
                defaultValue=""
                className="!w-100 !p-2 border rounded-lg bg-white text-gray-800 text-sm
                        focus:outline-none ring-2 focus:ring-blue-500 border-blue-400
                        transition duration-200"
            >
                <option value="" disabled>
                Validar
                </option>
                <option value="confirmar">Confirmar</option>
                <option value="negar">Negar</option>
            </select>
            <Button
              borderRadius="lg"
              bg="#055371"
              color="white"
              w={304}
              py="35px"
              fontSize="2xl"
              fontWeight="bold"
              _hover={{ bg: "#066d95" }}
            >
              Gerar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="!pt-6">
        <div className="flex flex-col items-center">
          <h1 className="!text-4xl !mb-4 !font-bold text-[#055371]">
            22/09/2025 - Reportagem 10
          </h1>

          {trilhas.map((trilha) => (
            <CardTrilha
              key={trilha.gMusicID}
              nome={trilha.nome}
              album={trilha.album}
              banda={trilha.banda}
              timestamp={trilha.timeStamp}
              politica={trilha.politica}
              gMusicID={trilha.gMusicID}
            />
          ))}
        </div>
      </main>
        <footer className="bg-[#055371] text-white !py-6 !mt-12 !text-center">
            <p className="text-lg font-medium">
                © {new Date().getFullYear()} - Sistema de Identificação de Trilhas Musicais
            </p>
            <p className="text-sm opacity-80">Desenvolvido pelo Squad 7 - Cesar School</p>
        </footer>
    </div>
  );
}
