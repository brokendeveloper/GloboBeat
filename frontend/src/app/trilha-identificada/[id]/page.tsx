"use client";

import TrackCard, { type Track } from "@/components/CardTrilha";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, use, useState } from "react";

type TrilhaStatus = "Identificada" | "Revisão Necessária";

interface TrilhaDetalhes {
  id: string;
  data: string;
  programa: string;
  editoria: string;
  status: TrilhaStatus;
  tracks: Track[];
}

const mockTrilhas: Record<string, TrilhaDetalhes> = {
  "1": {
    id: "1",
    data: "12/09/2025",
    programa: "Manhã Globo",
    editoria: "Cultura",
    status: "Identificada",
    tracks: [
      {
        nome: "Oceano",
        album: "Oceano",
        banda: "Djavan",
        timestamp: "00:23 - 01:00",
        politica: "Restrita",
        gMusicID: "GMUSIC-001",
      },
    ],
  },
  "2": {
    id: "2",
    data: "10/09/2025",
    programa: "Radar Cultural",
    editoria: "Entretenimento",
    status: "Revisão Necessária",
    tracks: [
      {
        nome: "Primavera",
        album: "Tim Maia",
        banda: "Tim Maia",
        timestamp: "00:45 - 01:10",
        politica: "Livre",
        gMusicID: "GMUSIC-045",
      },
    ],
  },
};

const statusColor: Record<TrilhaStatus, string> = {
  Identificada: "#00C853",
  "Revisão Necessária": "#FFC107",
};

export default function TrilhaIdentificadaDetalhes({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const trilha = mockTrilhas[id] || mockTrilhas["1"];

  const [status, setStatus] = useState<TrilhaStatus>(trilha.status);
  const [acaoSelecionada, setAcaoSelecionada] = useState<
    "" | "confirmar" | "negar"
  >(() => {
    if (trilha.status === "Identificada") return "confirmar";
    if (trilha.status === "Revisão Necessária") return "negar";
    return "";
  });

  const handleSelectAcao = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as "" | "confirmar" | "negar";
    setAcaoSelecionada(value);

    if (value === "confirmar") {
      setStatus("Identificada");
      return;
    }

    if (value === "negar") {
      setStatus("Revisão Necessária");
      return;
    }

    setStatus(trilha.status);
  };

  const handleGerarPDF = () => {
    console.log(`Gerando PDF da trilha ${trilha.id}`);
  };

  return (
    <Box as="main" flex={1} bg="white" p={8} px={32}>
      <Flex align="center" justify="space-between" mb={8}>
        <Link href="/trilha-identificada">
          <Flex
            align="center"
            gap={3}
            color="#055371"
            fontWeight="semibold"
            cursor="pointer"
            _hover={{ color: "#033a4f" }}
          >
            <Flex
              align="center"
              justify="center"
              w="32px"
              h="32px"
              bg="#055371"
              borderRadius="full"
            >
              <ArrowLeft size={18} color="white" />
            </Flex>
            Voltar
          </Flex>
        </Link>

        <Heading as="h1" size="lg" color="#055371" fontWeight="bold">
          {trilha.programa} - {trilha.data}
        </Heading>

        <Flex direction="column" gap={4} align="flex-end">
          <Text fontSize="lg" fontWeight="bold" color="#055371" mr={8}>
            Status:{" "}
            <Text as="span" color={statusColor[status]}>
              {status}
            </Text>
          </Text>

          <Text fontSize="md" color="#055371" mr={8}>
            Editoria: {trilha.editoria}
          </Text>

          <Flex direction="column" gap={3} align="flex-end" mr={5}>
            <Box w="250px">
              <select
                value={acaoSelecionada}
                onChange={handleSelectAcao}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "2px solid #055371",
                  backgroundColor: "white",
                  color: "#055371",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="">Selecione uma ação</option>
                <option value="confirmar">Confirmar trilha</option>
                <option value="negar">Negar trilha</option>
              </select>
            </Box>

          </Flex>
        </Flex>
      </Flex>

      <VStack gap={4} maxW="700px" mx="auto">
        {trilha.tracks.map((track, index) => (
          <TrackCard key={`${track.gMusicID}-${index}`} {...track} />
        ))}
      </VStack>

      <Flex justify="center" mt={8}>
        <Button
          onClick={handleGerarPDF}
          borderRadius="lg"
          variant="outline"
          borderColor="#055371"
          color="#055371"
          px={8}
          py={6}
          fontSize="md"
          fontWeight="bold"
          _hover={{ bg: "rgba(5, 83, 113, 0.08)" }}
        >
          <Flex align="center" gap={2}>
            <FileDown size={18} />
            Gerar PDF
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
}
