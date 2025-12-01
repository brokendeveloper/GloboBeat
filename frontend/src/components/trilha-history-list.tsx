"use client";

import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { statusColor } from "@/features/trilhas/types";
import { themeTokens } from "@/constants/theme";

export interface TrilhaHistoryItem {
  id: string;
  programa: string;
  trilha: string;
  timestamp: string;
  status: "Identificada" | "Revisão Necessária";
  video: {
    url: string;
    recordedAt: string;
    location: string;
  };
  tracks: string[];
}

interface TrilhaHistoryListProps {
  items: TrilhaHistoryItem[];
}

const statusFilters = [
  { label: "Todas", value: "all" },
  { label: "Identificadas", value: "Identificada" },
  { label: "Revisão necessária", value: "Revisão Necessária" },
] as const;

export function TrilhaHistoryList({ items }: TrilhaHistoryListProps) {
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]["value"]>("all");
  const [searchText, setSearchText] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesSearch =
        searchText.trim().length === 0 ||
        item.programa.toLowerCase().includes(searchText.toLowerCase()) ||
        item.trilha.toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [items, statusFilter, searchText]);

  const cardsPerRow = useBreakpointValue({ base: 1, md: 2 });

  return (
    <Stack spacing={5}>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={4}
        align={{ base: "stretch", md: "center" }}
      >
        <Flex gap={2} wrap="wrap">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              size="sm"
              variant={statusFilter === filter.value ? "solid" : "outline"}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </Flex>
        <Input
          placeholder="Busque por programa ou trilha"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          maxW={{ base: "100%", md: "280px" }}
          borderRadius="full"
        />
      </Flex>

      <Text fontSize="sm" color={themeTokens.textMuted}>
        Exibindo {filteredItems.length} de {items.length} reportagens monitoradas.
      </Text>

      <Stack spacing={4}>
        {filteredItems.length === 0 && (
          <Box
            textAlign="center"
            border="1px dashed"
            borderColor={themeTokens.borderSubtle}
            borderRadius="xl"
            py={12}
            px={6}
            color={themeTokens.textMuted}
          >
            Nenhuma reportagem encontrada para os filtros aplicados.
          </Box>
        )}

        <Stack spacing={4}>
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/trilha-identificada/${item.id}`} style={{ textDecoration: "none" }}>
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={5}
                p={5}
                borderRadius="xl"
                bg={themeTokens.surfaceMuted}
                border={`1px solid ${themeTokens.borderSubtle}`}
                transition="transform .2s ease, box-shadow .2s ease"
                _hover={{ transform: "translateY(-3px)", boxShadow: "0 12px 40px rgba(5,83,113,0.18)" }}
              >
                <Box flex="1">
                  <Flex justify="space-between" align="center" mb={3} wrap="wrap" gap={3}>
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
                  <Text color={themeTokens.textMuted} mb={3}>
                    Trilha principal: {item.trilha}
                  </Text>
                  <Box mb={3}>
                    <Text fontSize="xs" color={themeTokens.textMuted} textTransform="uppercase" letterSpacing="0.2em">
                      Trilhas identificadas ({item.tracks.length})
                    </Text>
                    <Flex gap={2} flexWrap="wrap" mt={2}>
                      {item.tracks.map((track) => (
                        <Box
                          key={`${item.id}-${track}`}
                          px={3}
                          py={1}
                          borderRadius="full"
                          bg={themeTokens.surfaceCard}
                          border={`1px solid ${themeTokens.borderSubtle}`}
                          fontSize="xs"
                          color={themeTokens.textPrimary}
                        >
                          {track}
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                  <Text fontSize="xs" color={themeTokens.textMuted}>
                    Última detecção em {item.video.recordedAt} • {item.video.location}
                  </Text>
                </Box>

                <Box
                  borderRadius="lg"
                  overflow="hidden"
                  flexBasis={{ base: "100%", md: cardsPerRow === 1 ? "100%" : "280px" }}
                  flexShrink={0}
                  boxShadow="sm"
                  border="1px solid"
                  borderColor={themeTokens.borderSubtle}
                  bg="black"
                >
                  <video
                    src={item.video.url}
                    muted
                    loop
                    playsInline
                    autoPlay
                    style={{ display: "block", width: "100%", height: "180px", objectFit: "cover" }}
                    aria-label={`Prévia da reportagem ${item.programa}`}
                  />
                </Box>
              </Flex>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
