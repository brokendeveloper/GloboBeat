"use client";

import TrackCard from "@/components/CardTrilha";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { FileDown } from "lucide-react";
import { useMemo } from "react";
import { statusColor, type TrilhaDetalhes } from "@/features/trilhas/types";
import { BackLink } from "@/components/back-link";
import { themeTokens } from "@/constants/theme";
import { ReportagemVideoPanel } from "@/components/reportagem-video-panel";
import { getReportagemVideo } from "@/constants/media";
import { useTrilhaStatus } from "@/features/trilhas/hooks";
import { StatusMessage } from "@/components/status-message";

interface TrilhaDetalheClientProps {
  id: string;
  initialTrilha: TrilhaDetalhes | null;
  requestId?: string | null;
  errorMessage?: string | null;
}

type Acao = "" | "confirmar" | "negar";

export function TrilhaDetalheClient({
  id,
  initialTrilha,
  requestId = null,
  errorMessage = null,
}: TrilhaDetalheClientProps) {
  const trilha = initialTrilha;
  const video = useMemo(() => {
    if (!trilha) return null;
    return getReportagemVideo(trilha.id);
  }, [trilha]);

  if (!trilha || !video) {
    return (
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={8} px={32}>
        <Flex align="center" justify="center" mb={8} position="relative">
          <Box position="absolute" left={0}>
            <BackLink href="/trilha-identificada" />
          </Box>
          <Heading as="h1" size="lg" color={themeTokens.textPrimary}>
            Detalhes da trilha
          </Heading>
        </Flex>

        <Box
          maxW="640px"
          mx="auto"
          bg={themeTokens.surfaceCard}
          borderRadius="2xl"
          border={`1px solid ${themeTokens.borderSubtle}`}
          p={8}
          textAlign="center"
        >
          <Text fontWeight="semibold" color={themeTokens.statusError} mb={3}>
            Não foi possível carregar os detalhes desta trilha.
          </Text>
          <Text color={themeTokens.textMuted}>
            {errorMessage ??
              "Revise o envio ou tente novamente a partir da página de trilhas identificadas."}
          </Text>
        </Box>
        {requestId && (
          <Text color={themeTokens.textMuted} fontSize="sm" mt={4} textAlign="center">
            Solicitação {requestId}
          </Text>
        )}
      </Box>
    );
  }

  return (
    <TrilhaDetalheView id={id} trilha={trilha} video={video} requestId={requestId} />
  );
}

interface TrilhaDetalheViewProps {
  id: string;
  trilha: TrilhaDetalhes;
  video: ReturnType<typeof getReportagemVideo>;
  requestId: string | null;
}

function TrilhaDetalheView({ id, trilha, video, requestId }: TrilhaDetalheViewProps) {
  const {
    status,
    acaoSelecionada,
    isSaving,
    successMessage,
    errorMessage: decisionError,
    selectAcao,
    persistDecision,
  } = useTrilhaStatus({ trilhaId: trilha.id, initialStatus: trilha.status });

  const handleGerarPDF = () => {
    console.log(`Gerando PDF da trilha ${trilha.id}`);
  };

  return (
    <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={8} px={32}>
      <Flex align="center" justify="space-between" mb={8} gap={6}>
        <BackLink href="/trilha-identificada" />

        <Box flex={1} textAlign="center">
          <Heading as="h1" size="lg" color={themeTokens.textPrimary} fontWeight="bold">
            {trilha.programa}
          </Heading>
          <Text color={themeTokens.textMuted}>
            {trilha.data} • {trilha.editoria}
          </Text>
          {requestId && (
            <Text color={themeTokens.textMuted} fontSize="sm" mt={1}>
              Solicitação {requestId}
            </Text>
          )}
        </Box>
        <Flex direction="column" gap={3} align="flex-end">
          <Box
            px={4}
            py={1.5}
            borderRadius="full"
            border={`1px solid ${statusColor[status]}`}
            color={statusColor[status]}
            fontWeight="bold"
          >
            {status}
          </Box>

          <Flex gap={2}>
            <Button
              size="sm"
              variant={acaoSelecionada === "confirmar" ? "solid" : "outline"}
              borderRadius="md"
              onClick={() => selectAcao("confirmar")}
            >
              Confirmar trilha
            </Button>
            <Button
              size="sm"
              variant={acaoSelecionada === "negar" ? "solid" : "outline"}
              colorScheme="orange"
              borderRadius="md"
              onClick={() => selectAcao("negar")}
            >
              Negar trilha
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <Box maxW="960px" mx="auto" mb={10}>
        <ReportagemVideoPanel
          title={`Trecho em análise • ${trilha.tracks[0]?.nome ?? "Trilha"}`}
          video={video}
          metadata={[
            { label: "Programa", value: trilha.programa },
            { label: "Editoria", value: trilha.editoria },
            { label: "Status", value: status },
            { label: "Processo", value: id },
          ]}
        />
      </Box>

      <VStack gap={4} maxW="700px" mx="auto">
        {trilha.tracks.map((track, index) => (
          <TrackCard key={`${track.gMusicID}-${index}`} {...track} />
        ))}
      </VStack>

      <Flex justify="center" mt={8} gap={4} align="center" flexWrap="wrap">
        <Button
          onClick={persistDecision}
          borderRadius="lg"
          bg={themeTokens.brandPrimary}
          color={themeTokens.brandOnPrimary}
          px={8}
          py={6}
          fontSize="md"
          fontWeight="bold"
          isLoading={isSaving}
          loadingText="Salvando"
          isDisabled={(acaoSelecionada as Acao) === "" || isSaving}
          _hover={{ bg: themeTokens.brandPrimaryStrong }}
        >
          Registrar decisão
        </Button>

        <Button
          onClick={handleGerarPDF}
          borderRadius="lg"
          variant="outline"
          borderColor={themeTokens.brandPrimary}
          color={themeTokens.brandPrimary}
          px={8}
          py={6}
          fontSize="md"
          fontWeight="bold"
          _hover={{ bg: "rgba(5, 83, 113, 0.08)" }}
        >
          <Flex align="center" gap={2}>
            <FileDown size={18} />
            Gerar PDF
          </Flex>
        </Button>
      </Flex>

      <Box mt={6}>
        <StatusMessage
          status={successMessage ? "success" : decisionError ? "error" : "idle"}
          message={successMessage ?? decisionError}
        />
      </Box>
    </Box>
  );
}
