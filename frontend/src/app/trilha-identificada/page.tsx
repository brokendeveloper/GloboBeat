import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import {
  statusColor,
  type TrilhaIdentificadaItem,
} from "@/features/trilhas/types";
import { trilhasIdentificadas } from "@/features/trilhas/data";
import { themeTokens } from "@/constants/theme";

export default async function TrilhasIdentificadas() {
  // TODO: remover atraso quando conectarmos aos dados reais
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return (
    <>
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={8} px={32}>
        <Flex align="center" justify="center" mb={8} position="relative">
          <Box position="absolute" left={0}>
            <BackLink href="/dashboard" />
          </Box>
          <Heading as="h1" size="xl" color={themeTokens.textPrimary} fontWeight="bold">
            Trilhas identificadas
          </Heading>
        </Flex>

        <Box
          bgGradient={themeTokens.panelGradient}
          borderRadius="lg"
          p={6}
          w="full"
          maxW="900px"
          mx="auto"
        >
          <Flex direction="column" gap={4}>
            {trilhasIdentificadas.map((item) => (
              <Link key={item.id} href={`/trilha-identificada/${item.id}`} style={{ textDecoration: "none" }}>
                <Box
                  p={5}
                  borderRadius="xl"
                  bg={themeTokens.surfaceMuted}
                  border={`1px solid ${themeTokens.borderSubtle}`}
                  transition="all .2s ease"
                  _hover={{
                    boxShadow: "0 8px 40px rgba(5, 83, 113, 0.2)",
                    transform: "translateY(-2px)",
                  }}
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Box>
                      <Text color={themeTokens.textPrimary} fontWeight="bold" fontSize="lg">
                        {item.programa}
                      </Text>
                      <Text fontSize="sm" color={themeTokens.textMuted}>
                        {item.timestamp}
                      </Text>
                    </Box>
                    <Box
                      px={4}
                      py={1}
                      borderRadius="full"
                      fontWeight="bold"
                      color={statusColor[item.status]}
                      border={`1px solid ${statusColor[item.status]}`}
                    >
                      {item.status}
                    </Box>
                  </Flex>
                  <Text color={themeTokens.textMuted}>Trilha: {item.trilha}</Text>
                </Box>
              </Link>
            ))}
          </Flex>
        </Box>
      </Box>
    </>
  );
}
