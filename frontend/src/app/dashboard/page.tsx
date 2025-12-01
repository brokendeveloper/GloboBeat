"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Button,
  IconButton,
  SimpleGrid,
  Progress,
} from "@chakra-ui/react";
import { X, Filter } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { themeTokens } from "@/constants/theme";

export default function Dashboard() {
  const summaryCards = [
    {
      label: "Trilhas identificadas",
      value: "128",
      trend: "+12%",
      trendLabel: "vs. semana anterior",
    },
    {
      label: "Pendências críticas",
      value: "5",
      trend: "-18%",
      trendLabel: "em relação a ontem",
    },
    {
      label: "Tempo médio de validação",
      value: "01h 12m",
      trend: "-08m",
      trendLabel: "de redução",
    },
    {
      label: "Detecções com erro",
      value: "2",
      trend: "-33%",
      trendLabel: "últimos 7 dias",
    },
  ];

  const musicas = [
    { nome: "Meu bem querer", plays: 6, progresso: 82 },
    { nome: "Pétala", plays: 4, progresso: 64 },
    { nome: "Samurai", plays: 4, progresso: 61 },
    { nome: "Sina", plays: 3, progresso: 48 },
    { nome: "Eu te devoro", plays: 2, progresso: 32 },
    { nome: "Oceano", plays: 1, progresso: 24 },
  ];

  const FILTER_OPTIONS = [
    { value: "ultimo_ano", label: "Último ano" },
    { value: "ultimo_semestre", label: "Último semestre" },
    { value: "ultimo_trimestre", label: "Último trimestre" },
    { value: "ultimo_bimestre", label: "Último bimestre" },
    { value: "ultimo_mes", label: "Último mês" },
  ];

  const [selectedFilterValue, setSelectedFilterValue] = useState("ultimo_ano");
  const [selectedFilterLabel, setSelectedFilterLabel] = useState("Último ano");

  const [panelSelection, setPanelSelection] = useState(selectedFilterValue);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = isPanelOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isPanelOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPanelOpen(false);
    };
    if (isPanelOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isPanelOpen]);

  const openPanel = () => {
    setPanelSelection(selectedFilterValue);
    setIsPanelOpen(true);
    setTimeout(() => closeBtnRef.current?.focus(), 100);
  };

  const handleSelectOption = (optValue: string) => {
    const chosen = FILTER_OPTIONS.find((f) => f.value === optValue);
    if (!chosen) return;
    setPanelSelection(chosen.value);
  };

  const applyPanelSelection = () => {
    const chosen = FILTER_OPTIONS.find((f) => f.value === panelSelection);
    if (chosen) {
      setSelectedFilterValue(chosen.value);
      setSelectedFilterLabel(chosen.label);
    }
    setIsPanelOpen(false);
  };

  const cancelPanel = () => {
    setPanelSelection(selectedFilterValue);
    setIsPanelOpen(false);
  };

  const handleValidar = () => {
    console.log("Gerar PDF - filtro:", selectedFilterLabel);
  };

  const validacao_selecionada = !!selectedFilterValue;

  return (
    <>
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={8} px={32}>
        <Flex align="center" justify="center" mb={8} position="relative">
          <Box position="absolute" left={0}>
            <BackLink href="/page_upload" />
          </Box>
          <Heading as="h1" fontSize="40px" color={themeTokens.textPrimary} fontWeight="bold">
            Dashboard
          </Heading>
        </Flex>

        <Box
          bgGradient={themeTokens.panelGradient}
          borderRadius="2xl"
          p={8}
          w="full"
          maxW="1500px"
          mx="auto"
          border={`1px solid ${themeTokens.borderSubtle}`}
          boxShadow="2xl"
        >
          <Flex justify="space-between" align="center" mb={8}>
            <Box>
              <Text fontSize="sm" color={themeTokens.textMuted} textTransform="uppercase">
                Panorama Geral
              </Text>
              <Heading as="h2" size="lg" color={themeTokens.textPrimary}>
                {selectedFilterLabel}
              </Heading>
            </Box>
            <Button
              aria-label="Abrir filtros"
              onClick={openPanel}
              bg={themeTokens.brandPrimary}
              color={themeTokens.brandOnPrimary}
              borderRadius="full"
              px={6}
              leftIcon={<Filter size={18} />}
              _hover={{ bg: themeTokens.brandPrimaryStrong }}
            >
              Ajustar filtros
            </Button>
          </Flex>

          <SimpleGrid columns={{ base: 1, lg: 4 }} gap={4}>
            {summaryCards.map((card) => (
              <Box
                key={card.label}
                borderRadius="xl"
                p={5}
                bg={themeTokens.surfaceCard}
                boxShadow="md"
                border={`1px solid ${themeTokens.borderSubtle}`}
              >
                <Text fontSize="sm" color={themeTokens.textMuted}>
                  {card.label}
                </Text>
                <Heading color={themeTokens.textPrimary} mt={3} fontSize="2xl">
                  {card.value}
                </Heading>
                <Text fontSize="sm" color={themeTokens.textMuted}>
                  <Text as="span" color={themeTokens.statusSuccess} fontWeight="semibold">
                    {card.trend}
                  </Text>{" "}
                  {card.trendLabel}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          <Flex direction={{ base: "column", lg: "row" }} gap={6} mt={10}>
            <Box flex={2} bg={themeTokens.surfaceCard} borderRadius="xl" p={6} boxShadow="lg" border={`1px solid ${themeTokens.borderSubtle}`}>
              <Flex justify="space-between" align="center" mb={4}>
                <Box>
                  <Text fontSize="sm" color={themeTokens.textMuted}>
                    Trilha em destaque
                  </Text>
                  <Heading as="h3" size="md" color={themeTokens.textPrimary}>
                    Top plays da semana
                  </Heading>
                </Box>
                <Button variant="ghost" color={themeTokens.textMuted} size="sm">
                  Ver todas
                </Button>
              </Flex>

              <VStack gap={4} align="stretch">
                {musicas.map((musica) => (
                  <Box key={musica.nome}>
                    <Flex justify="space-between" align="center">
                      <Text color={themeTokens.textPrimary} fontWeight="semibold">
                        {musica.nome}
                      </Text>
                      <Text color={themeTokens.textPrimary} fontWeight="bold">
                        {musica.plays} plays
                      </Text>
                    </Flex>
                    <Box
                      mt={2}
                      h="6px"
                      borderRadius="full"
                      bg={themeTokens.surfaceMuted}
                      overflow="hidden"
                    >
                      <Box
                        h="100%"
                        w={`${musica.progresso}%`}
                        bgGradient={themeTokens.brandGradient}
                        borderRadius="full"
                        transition="width 0.3s ease"
                      />
                    </Box>
                  </Box>
                ))}
              </VStack>
            </Box>

            <Box flex={1} bg={themeTokens.surfaceCard} borderRadius="xl" p={6} boxShadow="lg" border={`1px solid ${themeTokens.borderSubtle}`}>
              <Text fontSize="sm" color={themeTokens.textMuted} mb={2}>
                Ações rápidas
              </Text>
              <Heading as="h3" size="md" color={themeTokens.textPrimary}>
                Precisando de atenção
              </Heading>

              <VStack align="stretch" gap={3} mt={4}>
                {["Revisar trilhas pendentes", "Aprovar playlist especial", "Enviar relatório diário"].map(
                  (action) => (
                    <Button
                      key={action}
                      variant="ghost"
                      justifyContent="flex-start"
                      borderRadius="lg"
                      py={4}
                      color={themeTokens.textPrimary}
                      _hover={{ bg: themeTokens.surfaceMuted }}
                    >
                      {action}
                    </Button>
                  )
                )}
              </VStack>
            </Box>
          </Flex>

          <Box mt={10} bg={themeTokens.surfaceCard} borderRadius="xl" p={6} border={`1px solid ${themeTokens.borderSubtle}`} boxShadow="lg">
            <Text fontSize="sm" color={themeTokens.textMuted}>
              Últimas movimentações
            </Text>
            <Heading as="h3" size="md" color={themeTokens.textPrimary} mb={4}>
              Linha do tempo
            </Heading>
            <VStack align="stretch" gap={4}>
              {timelineEvents.map((event) => (
                <Flex key={event.title} gap={4}>
                  <Box w="8px" borderRadius="full" bg={themeTokens.brandPrimary} mt={1} />
                  <Box>
                    <Text fontWeight="semibold" color={themeTokens.textPrimary}>
                      {event.title}
                    </Text>
                    <Text color={themeTokens.textMuted} fontSize="sm">
                      {event.description}
                    </Text>
                    <Text fontSize="xs" color={themeTokens.textMuted}>
                      {event.time}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </VStack>
          </Box>
        </Box>

        <Flex justify="center" mt={8}>
          <Button
            onClick={handleValidar}
            borderRadius="lg"
            bg={themeTokens.brandPrimary}
            color={themeTokens.brandOnPrimary}
            px={12}
            py={7}
            fontSize="xl"
            fontWeight="bold"
            _hover={{ bg: themeTokens.brandPrimaryStrong }}
            disabled={!validacao_selecionada}
          >
            Gerar PDF
          </Button>
        </Flex>
      </Box>

      <Box
        as="div"
        display={isPanelOpen ? "block" : "none"}
        position="fixed"
        inset={0}
        bg="blackAlpha.600"
        zIndex={1000}
        onClick={cancelPanel}
      />
      <Box
        as="aside"
        position="fixed"
        top={0}
        right={0}
        height="100vh"
        width={{ base: "85%", md: "380px" }}
        maxW="100%"
        bg={themeTokens.surfaceCard}
        zIndex={1001}
        boxShadow="lg"
        transform={isPanelOpen ? "translateX(0)" : "translateX(110%)"}
        transition="transform 240ms ease"
        display="flex"
        flexDirection="column"
      >
        <Flex align="center" justify="space-between" p={4} borderBottom="1px solid" borderColor={themeTokens.borderSubtle} flexShrink={0}>
          <Heading size="md" color={themeTokens.textPrimary}>Filtros</Heading>
          <IconButton
            aria-label="Fechar filtros"
            icon={<X size={16} color={themeTokens.textPrimary} />}
            onClick={cancelPanel}
            ref={closeBtnRef}
            size="sm"
            bg="transparent"
          />
        </Flex>
        
        <Box p={4} overflowY="auto" flex="1">
          <Text mb={4} color={themeTokens.textPrimary} fontWeight="semibold">Selecione o período:</Text>
          <VStack as="div" role="radiogroup" aria-label="Período" align="stretch" gap={3}>
            {FILTER_OPTIONS.map((opt) => {
              const checked = panelSelection === opt.value;
              return (
                <Box
                  key={opt.value}
                  as="label"
                  cursor="pointer"
                  onClick={() => handleSelectOption(opt.value)}
                >
                  <input
                    type="radio"
                    name="periodo"
                    value={opt.value}
                    checked={checked}
                    onChange={() => handleSelectOption(opt.value)}
                    style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                  />
                  <Flex
                    align="center"
                    justify="space-between"
                    p={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={checked ? themeTokens.brandPrimary : themeTokens.borderSubtle}
                    bg={checked ? "var(--surface-muted)" : themeTokens.surfaceCard}
                    _hover={{ bg: themeTokens.surfaceMuted }}
                  >
                    <Text color={themeTokens.textPrimary} fontWeight={checked ? "semibold" : "normal"}>
                      {opt.label}
                    </Text>
                    {checked ? (
                      <Flex as="span" align="center" justify="center" w="22px" h="22px" borderRadius="full" bg={themeTokens.brandPrimary} aria-hidden="true">
                        <Box w="8px" h="8px" borderRadius="full" bg={themeTokens.brandOnPrimary} />
                      </Flex>
                    ) : (
                      <Box as="span" w="22px" h="22px" borderRadius="full" border="2px solid" borderColor={themeTokens.borderSubtle} aria-hidden="true" />
                    )}
                  </Flex>
                </Box>
              );
            })}
          </VStack>
        </Box>

        <Flex p={4} borderTop="1px solid" borderColor={themeTokens.borderSubtle} gap={3} flexShrink={0}>
          <Button variant="outline" onClick={cancelPanel} flex="1">
            Cancelar
          </Button>
          <Button onClick={applyPanelSelection} flex="1" bg={themeTokens.brandPrimary} color={themeTokens.brandOnPrimary} _hover={{ bg: themeTokens.brandPrimaryStrong }}>
            Aplicar
          </Button>
        </Flex>
      </Box>
    </>
  );
}
  const timelineEvents = [
    { title: "Reportagem aprovada", description: "Equipe RJ confirmou a trilha 'Oceano'", time: "15 min atrás" },
    { title: "Pendência escalada", description: "Central SP solicitou revisão urgente", time: "1h atrás" },
    { title: "Nova playlist", description: "Time de Conteúdo enviou 8 faixas", time: "Ontem" },
  ];
