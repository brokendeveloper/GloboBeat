"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { themeTokens } from "@/constants/theme";

interface ValidacaoItem {
  id: string;
  data: string;
  reportagem: string;
  status: "Validação Pendente";
}

export default function ValidacaoPage() {
  const validacoes: ValidacaoItem[] = [
    {
      id: "1",
      data: "22/09/2025",
      reportagem: "Reportagem10",
      status: "Validação Pendente",
    },
    {
      id: "2",
      data: "20/09/2025",
      reportagem: "Reportagem8",
      status: "Validação Pendente",
    },
    {
      id: "3",
      data: "19/09/2025",
      reportagem: "Reportagem7",
      status: "Validação Pendente",
    },
    {
      id: "4",
      data: "14/09/2025",
      reportagem: "Reportagem2",
      status: "Validação Pendente",
    },
  ];

  return (
    <>
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={{ base: 6, md: 10 }} display="flex" flexDirection="column" alignItems="center">
        <Flex align="center" justifyContent="space-between" mb={8} w="100%">
          <BackLink href="/page_upload" />
          <Button variant="outline" color={themeTokens.textPrimary} borderColor={themeTokens.borderSubtle}>
            Exportar pendências
          </Button>
        </Flex>

        <Heading as="h1" size="2xl" color={themeTokens.textPrimary} fontWeight="bold" mb={3}>
          Validações pendentes
        </Heading>
        <Text color={themeTokens.textMuted} mb={8}>
          Acompanhe o fluxo de validação e priorize casos críticos.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} maxW="1000px">
          {validacoes.map((item) => (
            <Link key={item.id} href={`/validacao/${item.id}`} style={{ textDecoration: "none" }}>
              <Box
                borderRadius="2xl"
                p={5}
                bg={themeTokens.surfaceCard}
                border={`1px solid ${themeTokens.borderSubtle}`}
                boxShadow="md"
                _hover={{ boxShadow: "0 10px 40px rgba(5,83,113,0.2)", transform: "translateY(-2px)" }}
                transition="all 0.2s ease"
              >
                <Flex justify="space-between" align="flex-start">
                  <Box>
                    <Text fontSize="sm" color={themeTokens.textMuted}>
                      {item.data}
                    </Text>
                    <Heading as="h3" size="md" color={themeTokens.textPrimary} mt={1}>
                      {item.reportagem}
                    </Heading>
                  </Box>
                  <Box
                    px={4}
                    py={1}
                    borderRadius="full"
                    bg="rgba(247, 183, 49, 0.1)"
                    border={`1px solid ${themeTokens.statusWarning}`}
                    color={themeTokens.statusWarning}
                    fontWeight="bold"
                  >
                    {item.status}
                  </Box>
                </Flex>
                <Text mt={4} color={themeTokens.textMuted} fontSize="sm">
                  Responsável: Equipe Editorial
                </Text>
                <Flex mt={3} gap={2}>
                  <Button size="sm" variant="ghost" color={themeTokens.statusSuccess}>
                    Aprovar
                  </Button>
                  <Button size="sm" variant="ghost" color={themeTokens.statusError}>
                    Rejeitar
                  </Button>
                </Flex>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
