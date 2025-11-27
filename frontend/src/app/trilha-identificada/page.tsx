"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type TrilhaStatus = "Identificada" | "Revisão Necessária";

interface TrilhaIdentificadaItem {
  id: string;
  timestamp: string;
  programa: string;
  trilha: string;
  status: TrilhaStatus;
}

const statusColor: Record<TrilhaStatus, string> = {
  Identificada: "#00C853",
  "Revisão Necessária": "#FFC107",
};

const trilhasIdentificadas: TrilhaIdentificadaItem[] = [
  {
    id: "1",
    timestamp: "00:23 - 01:00",
    programa: "Manhã Globo",
    trilha: "Oceano - Djavan",
    status: "Identificada",
  },
  {
    id: "2",
    timestamp: "00:45 - 01:15",
    programa: "Radar Cultural",
    trilha: "Primavera - Tim Maia",
    status: "Revisão Necessária",
  },
  {
    id: "3",
    timestamp: "00:10 - 00:37",
    programa: "Noite Beatles",
    trilha: "Something - The Beatles",
    status: "Identificada",
  },
  {
    id: "4",
    timestamp: "01:05 - 01:44",
    programa: "Conexão GloboNews",
    trilha: "Chega de Saudade - João Gilberto",
    status: "Revisão Necessária",
  },
];

export default function TrilhasIdentificadas() {
  return (
    <>
      <Box as="main" flex={1} bg="white" p={8} px={32}>
        <Flex align="center" justify="center" mb={8} position="relative">
          <Box position="absolute" left={0}>
            <Link href="/dashboard">
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
          </Box>
          <Heading as="h1" size="xl" color="#055371" fontWeight="bold">
            Trilhas identificadas
          </Heading>
        </Flex>

        <Box
          bg="#055371"
          borderRadius="lg"
          p={6}
          w="full"
          maxW="900px"
          mx="auto"
        >
          <Flex direction="column" gap={4}>
            {trilhasIdentificadas.map((item) => (
              <Link
                key={item.id}
                href={`/trilha-identificada/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <Flex
                  bg="white"
                  p={4}
                  borderRadius="md"
                  justify="space-between"
                  align="center"
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  transition="background 0.2s"
                >
                  <Box>
                    <Text color="#055371" fontWeight="semibold" fontSize="md">
                      {item.programa}
                    </Text>
                    <Text color="#4A5568" fontSize="sm">
                      Trilha: {item.trilha}
                    </Text>
                    <Text color="#4A5568" fontSize="sm">
                      Tempo: {item.timestamp}
                    </Text>
                  </Box>
                  <Text
                    color={statusColor[item.status]}
                    fontWeight="bold"
                    fontSize="md"
                  >
                    {item.status}
                  </Text>
                </Flex>
              </Link>
            ))}
          </Flex>
        </Box>
      </Box>
    </>
  );
}
