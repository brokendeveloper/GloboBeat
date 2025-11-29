"use client";

import { Box, Button, Flex, IconButton, Input, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

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
    setIsSearchOpen(false);
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
      case "musica": return "#00C853";
      case "reportagem": return "#2196F3";
      case "validacao": return "#FFC107";
      default: return "#055371";
    }
  };

  return (
    <Box
      as="header"
      w="full"
      bg="#055371"
      borderBottom="2px solid"
      borderColor="whiteAlpha.300"
      px={8}
      py={4}
    >
      <Flex align="center" justify="space-between">
        <Flex flex={1} align="center">
          {onMenuClick && (
            <IconButton
              aria-label="Abrir menu"
              onClick={onMenuClick}
              variant="ghost"
              color="white"
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
          <Box position="relative" ref={searchContainerRef}>
            <Flex
              align="center"
              bg="white"
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.400"
              py={1}
              pl={isSearchOpen ? 4 : 1}
              pr={1}
              transition="all 0.3s ease"
              minH="40px"
              overflow="hidden"
              gap={isSearchOpen ? 3 : 0}
            >
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outline"
                border="none"
                _focusVisible={{ boxShadow: "none" }}
                _focus={{ boxShadow: "none" }}
                placeholder="Buscar"
                color="#055371"
                width={isSearchOpen ? "180px" : "0px"}
                opacity={isSearchOpen ? 1 : 0}
                transition="width 0.3s ease, opacity 0.3s ease"
                minW={0}
                pointerEvents={isSearchOpen ? "auto" : "none"}
              />
              <Button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                variant="solid"
                bg="#055371"
                color="white"
                w="32px"
                h="32px"
                minW="32px"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{ bg: "#033a4f" }}
                aria-label="Buscar"
              >
                <Search size={18} />
              </Button>
            </Flex>

            {/* Search Results Dropdown */}
            {showResults && filteredResults.length > 0 && (
              <Box
                position="absolute"
                top="calc(100% + 8px)"
                right={0}
                bg="white"
                borderRadius="md"
                boxShadow="lg"
                border="1px solid"
                borderColor="gray.200"
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
                      _hover={{ bg: "gray.50" }}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      onClick={() => handleResultClick(result.link)}
                    >
                      <Flex justify="space-between" align="center" gap={3}>
                        <Box flex={1}>
                          <Text color="#055371" fontWeight="semibold" fontSize="sm">
                            {result.title}
                          </Text>
                          {result.subtitle && (
                            <Text color="gray.600" fontSize="xs">
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
                bg="white"
                borderRadius="md"
                boxShadow="lg"
                border="1px solid"
                borderColor="gray.200"
                minW="300px"
                p={4}
                zIndex={1000}
              >
                <Text color="gray.500" fontSize="sm" textAlign="center">
                  Nenhum resultado encontrado
                </Text>
              </Box>
            )}
          </Box>
          <Button
            variant="ghost"
            color="white"
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
