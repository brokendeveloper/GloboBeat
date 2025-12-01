"use client";

import { Box, Button, Flex, IconButton, Input, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { Menu, Moon, Search, Sun, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeMode } from "@/components/theme-provider";
import { themeTokens } from "@/constants/theme";

interface SearchResult {
  id: string;
  type: "musica" | "reportagem" | "validacao";
  title: string;
  subtitle?: string;
  link: string;
}

// Mock data for search
const mockSearchData: SearchResult[] = [
  { id: "1", type: "musica", title: "Oceano", subtitle: "Djavan", link: "/resultados/1" },
  { id: "2", type: "musica", title: "Meu bem querer", subtitle: "Djavan", link: "/resultados/2" },
  { id: "3", type: "musica", title: "Sina", subtitle: "Djavan", link: "/resultados/5" },
  { id: "4", type: "reportagem", title: "22/09/2025 - Reportagem9", link: "/historico/1" },
  { id: "5", type: "reportagem", title: "18/09/2025 - Reportagem6", link: "/historico/2" },
  { id: "6", type: "validacao", title: "22/09/2025 - Reportagem10", link: "/validacao/1" },
  { id: "7", type: "validacao", title: "20/09/2025 - Reportagem8", link: "/validacao/2" },
];

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useThemeMode();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = searchQuery.trim()
    ? mockSearchData.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.trim().length > 0);
  };

  const handleResultClick = (link: string) => {
    router.push(link);
    setSearchQuery("");
    setShowResults(false);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "musica": return "Música";
      case "reportagem": return "Histórico";
      case "validacao": return "Validação";
      default: return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "musica":
        return themeTokens.statusSuccess;
      case "reportagem":
        return themeTokens.brandOnPrimary;
      case "validacao":
        return themeTokens.statusWarning;
      default:
        return themeTokens.brandPrimary;
    }
  };

  const headerBorder = themeTokens.borderSubtle;
  const searchBg = themeTokens.surfaceCard;
  const searchText = themeTokens.textPrimary;
  const accentColor = themeTokens.brandOnPrimary;
  const resultsBg = themeTokens.surfaceCard;
  const resultsBorder = themeTokens.borderSubtle;
  const resultsHover = themeTokens.surfaceMuted;
  const resultsDivider = themeTokens.borderSubtle;
  const resultsSubtitle = themeTokens.textMuted;

  return (
    <Box
      as="header"
      w="full"
      borderBottom="2px solid"
      borderColor={headerBorder}
      px={8}
      py={4}
      bgGradient={themeTokens.brandGradient}
    >
      <Flex align="center" justify="space-between">
        <Flex flex={1} align="center">
          {onMenuClick && (
            <IconButton
              aria-label="Abrir menu"
              onClick={onMenuClick}
              variant="ghost"
              color={accentColor}
              _hover={{ bg: "whiteAlpha.200" }}
              size="sm"
            >
              <Menu size={20} />
            </IconButton>
          )}
        </Flex>

        {/* Logo centralizado */}
        <Flex flex={1} justify="center">
          <Link href="/page_upload">
            <Image
              src="/logo.png"
              alt="GloboBeat Logo"
              width={50}
              height={50}
              style={{ objectFit: "contain" }}
            />
          </Link>
        </Flex>

        {/* Ícones à direita */}
        <Flex flex={1} justify="flex-end" align="center" gap={4}>
          <Box position="relative" ref={searchContainerRef} minW={{ base: "200px", md: "320px" }}>
            <Flex
              align="center"
              bg={searchBg}
              borderRadius="full"
              border="1px solid"
              borderColor={themeTokens.borderSubtle}
              py={1}
              pl={3}
              pr={2}
              minH="42px"
              gap={2}
            >
              <Box
                as="span"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={themeTokens.brandPrimary}
              >
                <Search size={16} />
              </Box>
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchChange}
                variant="unstyled"
                placeholder="Buscar músicas ou reportagens"
                color={searchText}
                _placeholder={{ color: resultsSubtitle }}
              />
              {searchQuery && (
                <IconButton
                  aria-label="Limpar busca"
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setShowResults(false);
                    searchInputRef.current?.focus();
                  }}
                >
                  ×
                </IconButton>
              )}
            </Flex>

            {/* Search Results Dropdown */}
            {showResults && filteredResults.length > 0 && (
              <Box
                position="absolute"
                top="calc(100% + 8px)"
                right={0}
                bg={resultsBg}
                borderRadius="md"
                boxShadow="lg"
                border="1px solid"
                borderColor={resultsBorder}
                minW="300px"
                maxH="400px"
                overflowY="auto"
                zIndex={1000}
              >
                <VStack align="stretch" gap={0}>
                  {filteredResults.map((result) => (
                    <Box
                      key={result.id}
                      p={3}
                      cursor="pointer"
                      _hover={{ bg: resultsHover }}
                      borderBottom="1px solid"
                      borderColor={resultsDivider}
                      onClick={() => handleResultClick(result.link)}
                    >
                      <Flex justify="space-between" align="center" gap={3}>
                        <Box flex={1}>
                          <Text color={searchText} fontWeight="semibold" fontSize="sm">
                            {result.title}
                          </Text>
                          {result.subtitle && (
                            <Text color={resultsSubtitle} fontSize="xs">
                              {result.subtitle}
                            </Text>
                          )}
                        </Box>
                        <Text
                          fontSize="xs"
                          fontWeight="bold"
                          color={getTypeColor(result.type)}
                          px={2}
                          py={1}
                          borderRadius="md"
                          bg={`${getTypeColor(result.type)}15`}
                        >
                          {getTypeLabel(result.type)}
                        </Text>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {showResults && filteredResults.length === 0 && searchQuery.trim() && (
              <Box
                position="absolute"
                top="calc(100% + 8px)"
                right={0}
                bg={resultsBg}
                borderRadius="md"
                boxShadow="lg"
                border="1px solid"
                borderColor={resultsBorder}
                minW="300px"
                p={4}
                zIndex={1000}
              >
                <Text color={resultsSubtitle} fontSize="sm" textAlign="center">
                  Nenhum resultado encontrado
                </Text>
              </Box>
            )}
          </Box>

          <IconButton
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            onClick={toggleTheme}
            variant="ghost"
            color={accentColor}
            _hover={{ bg: "whiteAlpha.200" }}
            size="sm"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </IconButton>
          <Button
            variant="ghost"
            color={accentColor}
            size="sm"
            _hover={{ bg: "whiteAlpha.200" }}
            aria-label="Perfil"
          >
            <User size={20} />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
