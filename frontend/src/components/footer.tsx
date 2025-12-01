"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Flex, IconButton, Stack, Text } from "@chakra-ui/react";
import { Linkedin, Instagram, Youtube } from "lucide-react";
import { themeTokens } from "@/constants/theme";
import { useThemeMode } from "@/components/theme-provider";

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com" },
];

export function Footer() {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <Box
      as="footer"
      w="full"
      bg={
        isDark
          ? "linear-gradient(135deg, #101217, #181a22)"
          : "linear-gradient(135deg, #0e2d63, #1790c8)"
      }
      borderTop="1px solid"
      borderColor={themeTokens.borderSubtle}
      color={themeTokens.footerText}
      px={{ base: 5, md: 10 }}
      py={{ base: 6, md: 8 }}
    >
      <Stack spacing={5} maxW="1200px" mx="auto">
        <Flex align="center" justify="space-between" gap={{ base: 4, md: 6 }}>
          <Flex align="center" gap={3}>
            <Image
              src="/logo.png"
              alt="GloboBeat"
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
            />
            <Stack spacing={0}>
              <Text fontWeight="bold">GloboBeat</Text>
              <Text fontSize="xs" color={themeTokens.footerSubtle}>
                Monitoramento inteligente de trilhas
              </Text>
            </Stack>
          </Flex>

          <Flex gap={2}>
            {socialLinks.map((item) => (
              <IconButton
                as={Link}
                key={item.label}
                href={item.href}
                aria-label={item.label}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                color={themeTokens.footerText}
                _hover={{ bg: "whiteAlpha.200" }}
                size="sm"
              >
                <item.icon size={16} />
              </IconButton>
            ))}
          </Flex>
        </Flex>
      </Stack>

      <Box mt={6} pt={4} borderTop="1px solid" borderColor={themeTokens.borderSubtle}>
        <Flex
          maxW="1200px"
          mx="auto"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={3}
        >
          <Text fontSize="xs" color={themeTokens.footerSubtle}>
            © {new Date().getFullYear()} GloboBeat. Todos os direitos
            reservados.
          </Text>
          <Flex gap={6} fontSize="xs" color={themeTokens.footerSubtle}>
            <Link href="/termos">Termos de uso</Link>
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/suporte">Central de suporte</Link>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
