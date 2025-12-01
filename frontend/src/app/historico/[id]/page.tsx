"use client";

import TrackCard, { type Track } from "@/components/CardTrilha";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import { use, useState } from "react";
import { BackLink } from "@/components/back-link";
import { themeTokens } from "@/constants/theme";
import { ReportagemVideoPanel } from "@/components/reportagem-video-panel";
import { getReportagemVideo } from "@/constants/media";

interface ReportagemDetalhes {
  id: string;
  data: string;
  reportagem: string;
  status: "Validação Confirmada" | "Validação Negada";
  tracks: Track[];
}

// Mock data - In production, fetch based on params.id
const mockReportagens: Record<string, ReportagemDetalhes> = {
  "1": {
    id: "1",
    data: "22/09/2025",
    reportagem: "Reportagem9",
    status: "Validação Confirmada",
    tracks: [
      {
        nome: "Oceano",
        album: "Oceano",
        banda: "Djavan",
        timestamp: "00:23 - 01:00",
        politica: "(Não encontrado/ restrita/ livre)",
        gMusicID: "XXXXXXXXXXX",
      },
    ],
  },
  "2": {
    id: "2",
    data: "18/09/2025",
    reportagem: "Reportagem6",
    status: "Validação Confirmada",
    tracks: [
      {
        nome: "Sample Track",
        album: "Sample Album",
        banda: "Sample Artist",
        timestamp: "00:00 - 00:30",
        politica: "(Não encontrado/ restrita/ livre)",
        gMusicID: "XXXXXXXXXXX",
      },
    ],
  },
  "3": {
    id: "3",
    data: "17/09/2025",
    reportagem: "Reportagem5",
    status: "Validação Negada",
    tracks: [
      {
        nome: "Sample Track",
        album: "Sample Album",
        banda: "Sample Artist",
        timestamp: "00:00 - 00:30",
        politica: "(Não encontrado/ restrita/ livre)",
        gMusicID: "XXXXXXXXXXX",
      },
    ],
  },
};

export default function ReportagemDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const reportagem = mockReportagens[id] || mockReportagens["1"];
  const [resumo, setResumo] = useState(
    "Trilha validada sem restrições. Disponível para uso editorial."
  );
  const video = getReportagemVideo(reportagem.id);

  const getStatusColor = () => {
    return reportagem.status === "Validação Confirmada"
      ? themeTokens.statusSuccess
      : themeTokens.statusError;
  };

  return (
    <>
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={8} px={32}>
        <Flex align="center" justify="space-between" mb={8}>
          <BackLink href="/historico" />

          <Box textAlign="center" flex={1}>
            <Text fontSize="sm" color={themeTokens.textMuted}>
              Registro completo
            </Text>
            <Heading as="h1" size="lg" color={themeTokens.textPrimary} fontWeight="bold">
              {reportagem.reportagem}
            </Heading>
            <Text color={themeTokens.textMuted}>{reportagem.data}</Text>
          </Box>

          <Flex direction="column" gap={3} align="flex-end">
            <Box
              px={4}
              py={1}
              borderRadius="full"
              border={`1px solid ${getStatusColor()}`}
              color={getStatusColor()}
              fontWeight="bold"
            >
              {reportagem.status}
            </Box>
            <Button
              borderRadius="lg"
              bg={themeTokens.brandPrimary}
              color={themeTokens.brandOnPrimary}
              px={6}
              py={4}
              fontSize="md"
              fontWeight="bold"
              _hover={{ bg: themeTokens.brandPrimaryStrong }}
            >
              Baixar PDF
            </Button>
          </Flex>
        </Flex>

        <Box maxW="1100px" mx="auto" mb={8}>
          <ReportagemVideoPanel
            title="Trecho exibido ao vivo"
            video={video}
            metadata={[
              { label: "Reportagem", value: reportagem.reportagem },
              { label: "Status", value: reportagem.status },
              {
                label: "Timestamp",
                value: reportagem.tracks[0]?.timestamp ?? "—",
              },
            ]}
          />
        </Box>

        <VStack align="stretch" gap={3} maxW="900px" mx="auto" mb={4}>
          <Flex align="center" justify="space-between">
            <Heading size="md" color={themeTokens.textPrimary}>
              Trilhas reconhecidas
            </Heading>
            <Text fontSize="sm" color={themeTokens.textMuted}>
              {reportagem.tracks.length} registros
            </Text>
          </Flex>
          <Text fontSize="sm" color={themeTokens.textMuted}>
            Confira abaixo todos os trechos musicais reconhecidos nesta reportagem,
            com políticas e timestamps para rápida reconsulta.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} maxW="900px" mx="auto">
          {reportagem.tracks.map((track, index) => (
            <Box key={`${track.gMusicID}-${index}`} position="relative">
              <Box
                position="absolute"
                top={-3}
                left={-3}
                px={3}
                py={1}
                borderRadius="full"
                bg={themeTokens.panelGradient}
                color={themeTokens.textPrimary}
                fontSize="xs"
                fontWeight="bold"
                boxShadow="0 6px 18px rgba(0,0,0,0.12)"
              >
                #{index + 1}
              </Box>
              <TrackCard {...track} />
            </Box>
          ))}
        </SimpleGrid>

        <Flex direction={{ base: "column", lg: "row" }} gap={6} mt={10}>
          <Box flex={2} bg={themeTokens.surfaceCard} borderRadius="xl" p={5} border={`1px solid ${themeTokens.borderSubtle}`}>
            <Text fontWeight="semibold" color={themeTokens.textPrimary}>
              Notas da auditoria
            </Text>
            <Textarea
              mt={3}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              bg={themeTokens.surfaceMuted}
              borderColor={themeTokens.borderSubtle}
              minH="140px"
            />
          </Box>
          <Box flex={1} bg={themeTokens.surfaceCard} borderRadius="xl" p={5} border={`1px solid ${themeTokens.borderSubtle}`}>
            <Text fontWeight="semibold" color={themeTokens.textPrimary}>
              Próximos passos
            </Text>
            <VStack align="stretch" gap={3} mt={3}>
              <Button variant="ghost" justifyContent="flex-start" color={themeTokens.statusSuccess}>
                Disponibilizar para reprise
              </Button>
              <Button variant="ghost" justifyContent="flex-start" color={themeTokens.textPrimary}>
                Notificar equipe de trilhas
              </Button>
              <Button variant="ghost" justifyContent="flex-start" color={themeTokens.statusWarning}>
                Monitorar possíveis strikes
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
