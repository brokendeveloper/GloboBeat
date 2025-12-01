import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { BackLink } from "@/components/back-link";
import { type TrilhaIdentificadaItem } from "@/features/trilhas/types";
import { themeTokens } from "@/constants/theme";
import { fetchTrilhasIdentificadas } from "@/features/trilhas/api";
import { getReportagemVideo } from "@/constants/media";
import { trilhaDetalhesMap } from "@/features/trilhas/data";
import { TrilhaHistoryList } from "@/components/trilha-history-list";

interface TrilhasIdentificadasProps {
  searchParams?: Promise<{ requestId?: string }>;
}

export default async function TrilhasIdentificadas({
  searchParams,
}: TrilhasIdentificadasProps) {
  let trilhas: TrilhaIdentificadaItem[] = [];
  let errorMessage: string | null = null;

  try {
    trilhas = await fetchTrilhasIdentificadas();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro ao buscar as trilhas identificadas.";
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const requestId = resolvedSearchParams.requestId;

  const trilhasComVideo = trilhas.map((item) => ({
    ...item,
    video: getReportagemVideo(item.id),
    tracks: trilhaDetalhesMap[item.id]?.tracks.map((track) => track.nome) ?? [item.trilha],
  }));

  return (
    <>
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={8} px={32}>
        <Flex align="center" justify="center" mb={8} position="relative">
          <Box position="absolute" left={0}>
            <BackLink href="/page_upload" />
          </Box>
          <Heading as="h1" size="xl" color={themeTokens.textPrimary} fontWeight="bold">
            Histórico de análises
          </Heading>
        </Flex>

        <Text textAlign="center" color={themeTokens.textMuted} mb={requestId ? 2 : 6}>
          Acompanhe todas as reportagens já analisadas e acesse novamente o detalhamento de cada trilha.
        </Text>
        {requestId && (
          <Text textAlign="center" color={themeTokens.textMuted} mb={6}>
            Último envio registrado com o protocolo <strong>{requestId}</strong>
          </Text>
        )}

        <Box
          bgGradient={themeTokens.panelGradient}
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          w="full"
          maxW="1100px"
          mx="auto"
        >
          {errorMessage ? (
            <Box textAlign="center" color={themeTokens.statusError} fontWeight="semibold">
              {errorMessage}
            </Box>
          ) : trilhasComVideo.length === 0 ? (
            <Box textAlign="center" color={themeTokens.textMuted} fontWeight="medium">
              Nenhuma trilha foi identificada para este envio.
            </Box>
          ) : (
            <TrilhaHistoryList items={trilhasComVideo} />
          )}
        </Box>
      </Box>
    </>
  );
}
