"use client";

import { Box, Flex, Heading, Text, Button, SimpleGrid } from "@chakra-ui/react";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { themeTokens } from "@/constants/theme";

interface HistoricoItem {
  id: string;
  data: string;
  reportagem: string;
  status: "Validação Confirmada" | "Validação Negada";
}

export default function HistoricoPage() {
  const historico: HistoricoItem[] = [
    {
      id: "1",
      data: "21/09/2025",
      reportagem: "Reportagem9",
      status: "Validação Confirmada",
    },
    {
      id: "2",
      data: "18/09/2025",
      reportagem: "Reportagem6",
      status: "Validação Confirmada",
    },
    {
      id: "3",
      data: "17/09/2025",
      reportagem: "Reportagem5",
      status: "Validação Negada",
    },
    {
      id: "4",
      data: "16/09/2025",
      reportagem: "Reportagem4",
      status: "Validação Confirmada",
    },
    {
      id: "5",
      data: "15/09/2025",
      reportagem: "Reportagem3",
      status: "Validação Confirmada",
    },
    {
      id: "6",
      data: "13/09/2025",
      reportagem: "Reportagem1",
      status: "Validação Negada",
    },
  ];

  return (
    <>
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={{ base: 6, md: 10 }}>
        <Flex align="center" justify="space-between" mb={8}>
          <BackLink href="/page_upload" />
          <Button variant="ghost" color={themeTokens.textPrimary}>
            Exportar histórico
          </Button>
        </Flex>

        <Heading as="h1" size="2xl" color={themeTokens.textPrimary} fontWeight="bold">
          Histórico de validações
        </Heading>
        <Text color={themeTokens.textMuted} mb={8}>
          Consulte as últimas decisões e acompanhe as reportagens validadas.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
          {historico.map((item) => (
            <Link key={item.id} href={`/historico/${item.id}`} style={{ textDecoration: "none" }}>
              <Box
                borderRadius="2xl"
                p={5}
                bg={themeTokens.surfaceCard}
                border={`1px solid ${themeTokens.borderSubtle}`}
                boxShadow="lg"
                _hover={{ boxShadow: "0 10px 40px rgba(5,83,113,0.18)", transform: "translateY(-2px)" }}
                transition="all .2s ease"
              >
                <Text fontSize="sm" color={themeTokens.textMuted}>
                  {item.data}
                </Text>
                <Heading as="h3" size="md" color={themeTokens.textPrimary} mt={2}>
                  {item.reportagem}
                </Heading>
                <Text mt={2} color={themeTokens.textMuted} fontSize="sm">
                  Editor responsável: Equipe RJ
                </Text>
                <Box
                  mt={4}
                  px={4}
                  py={1}
                  borderRadius="full"
                  color={item.status === "Validação Confirmada" ? themeTokens.statusSuccess : themeTokens.statusError}
                  border={`1px solid ${
                    item.status === "Validação Confirmada" ? themeTokens.statusSuccess : themeTokens.statusError
                  }`}
                  fontWeight="bold"
                  width="fit-content"
                >
                  {item.status}
                </Box>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
