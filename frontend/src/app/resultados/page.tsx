"use client";

import { Box, Flex, Heading, ListItem, Text, List } from "@chakra-ui/react";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { themeTokens } from "@/constants/theme";

export interface Resultado {
  nome: string;
  status: "Livre" | "Restrita";
  id: string;
}

export default function Resultados() {
  const resultados = [
    { id: "1", nome: "Oceano", banda: "Djavan", status: "Livre" },
    { id: "2", nome: "Meu bem querer", banda: "Djavan", status: "Livre" },
    { id: "3", nome: "Pétala", banda: "Djavan", status: "Livre" },
    { id: "4", nome: "Samurai", banda: "Djavan", status: "Livre" },
    { id: "5", nome: "Sina", banda: "Djavan", status: "Livre" },
    { id: "6", nome: "Eu te devoro", banda: "Fagner", status: "Restrita" },
  ];

  return (
    <>
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={8} px={32}>
        <Flex align="center" justify="center" mb={8} position="relative">
          <Box position="absolute" left={0}>
            <BackLink href="/page_upload" />
          </Box>
          <Heading as="h1" size="xl" color={themeTokens.textPrimary} fontWeight="bold">
            Resultados
          </Heading>
        </Flex>
        <Box
          bgGradient={themeTokens.panelGradient}
          border="1px solid"
          borderColor={themeTokens.borderSubtle}
          borderRadius="2xl"
          p={6}
          w="full"
          maxW="900px"
          mx="auto"
          boxShadow="lg"
        >
          <List.Root margin={0} spaceY={4}>
            {resultados.map((resultado, index) => (
              <Link href={`/resultados/${resultado.id}`} key={index} style={{ textDecoration: "none" }}>
                <ListItem
                  key={index}
                  bg={themeTokens.surfaceCard}
                  p={4}
                  borderRadius="md"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  color={themeTokens.textPrimary}
                  border={`1px solid ${themeTokens.borderSubtle}`}
                  _hover={{ boxShadow: "0 8px 30px rgba(5,83,113,0.15)" }}
                >
                  <Box>
                    <Text fontWeight="bold">{resultado.nome}</Text>
                    <Text fontSize="sm" color={themeTokens.textMuted}>
                      {resultado.banda}
                    </Text>
                  </Box>
                  <Text
                    color={resultado.status === "Livre" ? themeTokens.statusSuccess : themeTokens.statusError}
                    fontWeight="bold"
                  >
                    {resultado.status}
                  </Text>
                </ListItem>
              </Link>
            ))}
          </List.Root>
        </Box>
      </Box>
    </>
  );
}
