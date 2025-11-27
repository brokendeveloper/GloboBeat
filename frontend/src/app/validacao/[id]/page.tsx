"use client";

import TrackCard, { type Track } from "@/components/CardTrilha";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

interface ValidacaoDetalhes {
  id: string;
  data: string;
  reportagem: string;
  status: "Pendente" | "Confirmada" | "Negada";
  tracks: Track[];
}

// Mock data
const mockValidacoes: Record<string, ValidacaoDetalhes> = {
  "1": {
    id: "1",
    data: "22/09/2025",
    reportagem: "Reportagem10",
    status: "Pendente",
    tracks: [
      {
        nome: "Oceano",
        album: "Oceano",
        banda: "Djavan",
        timestamp: "00:23 - 01:00",
        politica: "(Não encontrada/Restrita/Livre)",
        gMusicID: "XXXXXXXXXX",
      },
    ],
  },
};

export default function ValidacaoDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const validacao = mockValidacoes[id] || mockValidacoes["1"];
  const [status, setStatus] = useState(validacao.status);
  const [validacao_selecionada, setValidacaoSelecionada] = useState("");

  const handleValidar = () => {
    if (validacao_selecionada === "confirmar") {
      setStatus("Confirmada");
    } else if (validacao_selecionada === "negar") {
      setStatus("Negada");
    }
  };

  const getStatusColor = () => {
    if (status === "Confirmada") return "#00C853";
    if (status === "Negada") return "#FF1744";
    return "#FFC107";
  };

  return (
    <>
      <Box as="main" flex={1} bg="white" p={8} px={32}>
        <Flex align="center" justify="space-between" mb={8}>
          <Link href="/validacao">
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
            {validacao.data} - {validacao.reportagem}
          </Heading>

          <Flex direction="column" gap={4} align="flex-end">
            <Text fontSize="lg" fontWeight="bold" color="#055371" mr={8}>
              Status: <Text as="span" color={getStatusColor()}>{status}</Text>
            </Text>

            <Box>
              <select
                value={validacao_selecionada}
                onChange={(e) => setValidacaoSelecionada(e.target.value)}
                style={{
                  width: "200px",
                  padding: "8px 12px",
                  border: "2px solid #055371",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: "#055371",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <option value="">Validar</option>
                <option value="confirmar">Confirmar</option>
                <option value="negar">Negar</option>
              </select>
            </Box>

            <Button
              onClick={handleValidar}
              borderRadius="lg"
              bg="#055371"
              color="white"
              px={8}
              py={6}
              mr={5}
              fontSize="lg"
              fontWeight="bold"
              _hover={{ bg: "#066d95" }}
              disabled={!validacao_selecionada}
            >
              Gerar PDF
            </Button>
          </Flex>
        </Flex>

        <VStack gap={4} maxW="700px" mx="auto">
          {validacao.tracks.map((track, index) => (
            <TrackCard key={`${track.gMusicID}-${index}`} {...track} />
          ))}
        </VStack>
      </Box>
    </>
  );
}
