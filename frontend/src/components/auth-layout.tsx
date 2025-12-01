"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { themeTokens } from "@/constants/theme";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  switchAccount: {
    question: string;
    actionLabel: string;
    href: string;
  };
  highlight?: {
    eyebrow: string;
    headline: string;
    description: string;
    stats?: Array<{ label: string; value: string }>;
  };
  children: React.ReactNode;
  footerNote?: React.ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  switchAccount,
  highlight = {
    eyebrow: "Monitoramento seguro",
    headline: "Fluxo homologado pela Globo",
    description:
      "Interface conectada ao pipeline de identificação sonora para acelerar o clearance de reportagens especiais.",
  },
  children,
  footerNote,
}: AuthLayoutProps) {
  return (
    <Flex direction="column" minH="100vh" bgGradient="linear(to-b, var(--brand-primary), var(--brand-primary-strong))">
      <Flex as="header" w="full" px={{ base: 6, md: 12 }} py={6} align="center" justify="space-between">
        <Box w="64px" h="48px" display="flex" alignItems="center" justifyContent="flex-start">
          <Image src="/logo.png" alt="GloboBeat" width={48} height={48} style={{ objectFit: "contain" }} />
        </Box>
        <Flex align="center" gap={3}>
          <Text color="white" fontSize="sm">
            {switchAccount.question}
          </Text>
          <Link href={switchAccount.href}>
            <Button variant="outline" color="white" borderColor="whiteAlpha.600" _hover={{ bg: "whiteAlpha.200" }}>
              {switchAccount.actionLabel}
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Flex as="main" flex={1} align="center" justify="center" px={{ base: 4, md: 10 }} py={{ base: 8, md: 12 }}>
        <Flex
          w="full"
          maxW="1100px"
          borderRadius="3xl"
          overflow="hidden"
          border="1px solid"
          borderColor="whiteAlpha.200"
          boxShadow="0 40px 80px rgba(0,0,0,0.35)"
          bg="rgba(255,255,255,0.03)"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Box
            flex={1}
            px={{ base: 6, md: 10 }}
            py={{ base: 10, md: 14 }}
            bg="rgba(0,0,0,0.2)"
            backdropFilter="blur(12px)"
            color="white"
          >
            <Text textTransform="uppercase" fontSize="sm" letterSpacing="0.4em" color="whiteAlpha.700">
              {highlight.eyebrow}
            </Text>
            <Heading mt={4} fontSize={{ base: "2xl", md: "3xl" }}>
              {highlight.headline}
            </Heading>
            <Text mt={4} color="whiteAlpha.800">
              {highlight.description}
            </Text>

            {highlight.stats && (
              <Stack direction={{ base: "column", sm: "row" }} gap={4} mt={8}>
                {highlight.stats.map((stat) => (
                  <Box key={stat.label}>
                    <Text fontSize="2xl" fontWeight="bold">
                      {stat.value}
                    </Text>
                    <Text fontSize="sm" color="whiteAlpha.700">
                      {stat.label}
                    </Text>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          <Box
            flex={1}
            bg={themeTokens.surfaceCard}
            color={themeTokens.textPrimary}
            px={{ base: 6, md: 10 }}
            py={{ base: 8, md: 12 }}
          >
            <VStack align="stretch" spacing={2} mb={8}>
              <Heading size="lg">{title}</Heading>
              <Text color={themeTokens.textMuted}>{subtitle}</Text>
            </VStack>
            {children}
            {footerNote && (
              <Box mt={6} color={themeTokens.textMuted} fontSize="sm">
                {footerNote}
              </Box>
            )}
          </Box>
        </Flex>
      </Flex>

      <Box as="footer" py={8} textAlign="center">
        <Text color="whiteAlpha.700" fontSize="sm">
          © {new Date().getFullYear()} Globo • Segurança de Conteúdo e Trilhas
        </Text>
      </Box>
    </Flex>
  );
}
