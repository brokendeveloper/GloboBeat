"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { themeTokens } from "@/constants/theme";

export default function NotFound() {
  return (
    <Flex
      as="main"
      flex={1}
      minH="100vh"
      align="center"
      justify="center"
      bg={themeTokens.surfaceBg}
      px={{ base: 6, md: 12 }}
      py={{ base: 16, md: 24 }}
    >
      <Box
        w="full"
        maxW="960px"
        bgGradient={themeTokens.panelGradient}
        borderRadius="3xl"
        border="1px solid"
        borderColor={themeTokens.borderSubtle}
        boxShadow="0 30px 80px rgba(5, 83, 113, 0.25)"
        overflow="hidden"
      >
        <Flex direction={{ base: "column", md: "row" }}>
          <Flex
            flex={1}
            align="center"
            justify="center"
            bg="rgba(10,34,58,0.7)"
            p={{ base: 8, md: 12 }}
            position="relative"
          >
            <Box textAlign="center" color={themeTokens.brandOnPrimary}>
              <Box mb={6}>
                <Image src="/logo.png" alt="GloboBeat" width={72} height={72} />
              </Box>
              <Text fontSize="lg" letterSpacing="widest" textTransform="uppercase">
                GloboBeat
              </Text>
              <Heading mt={2} fontSize="72px" lineHeight="1" fontWeight="black">
                404
              </Heading>
              <Text opacity={0.8} mt={3} fontSize="sm">
                Página não encontrada
              </Text>
            </Box>
          </Flex>

          <Box flex={1.4} p={{ base: 8, md: 12 }} bg={themeTokens.surfaceCard}>
            <VStack align="stretch" spacing={6}>
              <Box>
                <Text fontSize="sm" color={themeTokens.textMuted} textTransform="uppercase" letterSpacing="0.4em">
                  erro 404
                </Text>
                <Heading mt={2} fontSize="3xl" color={themeTokens.textPrimary}>
                  O conteúdo que você procura não está aqui
                </Heading>
                <Text mt={4} color={themeTokens.textMuted} lineHeight="tall">
                  O link pode ter sido removido, renomeado ou estar indisponível no momento. Continue a navegação pelos nossos fluxos seguros de upload e auditoria para garantir o acompanhamento das trilhas identificadas.
                </Text>
              </Box>

              <Flex gap={4} flexWrap="wrap">
                <Link href="/trilha-identificada">
                  <Button
                    bg={themeTokens.brandPrimary}
                    color={themeTokens.brandOnPrimary}
                    px={8}
                    py={6}
                    borderRadius="lg"
                    fontWeight="bold"
                    _hover={{ bg: themeTokens.brandPrimaryStrong }}
                  >
                    Voltar ao painel
                  </Button>
                </Link>
                <Link href="/trilha-identificada">
                  <Button variant="ghost" borderRadius="lg" px={8} py={6} color={themeTokens.brandPrimary}>
                    Ver histórico
                  </Button>
                </Link>
              </Flex>

              <Box mt={4} p={4} borderRadius="lg" border="1px solid" borderColor={themeTokens.borderSubtle} bg={themeTokens.surfaceMuted}>
                <Text fontSize="sm" color={themeTokens.textMuted}>
                  Precisa de ajuda? Entre em contato com o time GloboBeat pelo canal interno ou acesse a Central de suporte.
                </Text>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
