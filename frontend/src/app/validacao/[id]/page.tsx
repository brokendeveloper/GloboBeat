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

interface ValidacaoDetalhes {
  id: string;
  data: string;
  reportagem: string;
  status: "Pendente" | "Confirmada" | "Negada";
  tracks: Track[];
}

// Mock data
const mockValidacoes: Record<string, ValidacaoDetalhes> = {
  "1": {
    id: "1",
    data: "22/09/2025",
    reportagem: "Reportagem10",
    status: "Pendente",
    tracks: [
      {
        nome: "Oceano",
        album: "Oceano",
        banda: "Djavan",
        timestamp: "00:23 - 01:00",
        politica: "(Não encontrada/Restrita/Livre)",
        gMusicID: "XXXXXXXXXX",
      },
    ],
  },
};

export default function ValidacaoDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const validacao = mockValidacoes[id] || mockValidacoes["1"];
  const [status, setStatus] = useState(validacao.status);
  const [validacao_selecionada, setValidacaoSelecionada] = useState("");
  const [comentario, setComentario] = useState("");

  const activity = [
    { title: "Trilha analisada", author: "Equipe RJ", time: "Hoje • 10:12" },
    { title: "Pendência aberta", author: "Central SP", time: "Ontem • 18:40" },
  ];

  const handleValidar = () => {
    if (validacao_selecionada === "confirmar") {
      setStatus("Confirmada");
    } else if (validacao_selecionada === "negar") {
      setStatus("Negada");
    }
  };

  const getStatusColor = () => {
    if (status === "Confirmada") return themeTokens.statusSuccess;
    if (status === "Negada") return themeTokens.statusError;
    return themeTokens.statusWarning;
  };

  const video = getReportagemVideo(validacao.id);

  return (
    <>
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={8} px={32}>
        <Flex align="center" justify="space-between" mb={8}>
          <BackLink href="/validacao" />

          <Box textAlign="center" flex={1}>
            <Text fontSize="sm" color={themeTokens.textMuted}>
              Validação em andamento
            </Text>
            <Heading as="h1" size="lg" color={themeTokens.textPrimary} fontWeight="bold">
              {validacao.reportagem}
            </Heading>
            <Text color={themeTokens.textMuted}>{validacao.data}</Text>
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
              {status}
            </Box>
            <select
              value={validacao_selecionada}
              onChange={(e) => setValidacaoSelecionada(e.target.value)}
              style={{
                width: "200px",
                padding: "8px 12px",
                border: `2px solid ${themeTokens.borderSubtle}`,
                borderRadius: "8px",
                backgroundColor: "var(--surface-card)",
                color: themeTokens.textPrimary as string,
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              <option value="">Validar</option>
              <option value="confirmar">Confirmar</option>
              <option value="negar">Negar</option>
            </select>
            <Button
              onClick={handleValidar}
              borderRadius="lg"
              bg={themeTokens.brandPrimary}
              color={themeTokens.brandOnPrimary}
              px={6}
              py={4}
              fontSize="md"
              fontWeight="bold"
              _hover={{ bg: themeTokens.brandPrimaryStrong }}
              disabled={!validacao_selecionada}
            >
              Gerar PDF
            </Button>
          </Flex>
        </Flex>

        <Box maxW="1100px" mx="auto" mb={8}>
          <ReportagemVideoPanel
            title="Trecho aguardando validação"
            video={video}
            metadata={[
              { label: "Reportagem", value: validacao.reportagem },
              { label: "Status atual", value: status },
              {
                label: "Timestamp",
                value: validacao.tracks[0]?.timestamp ?? "—",
              },
            ]}
          />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={8}>
          <Box borderRadius="xl" p={4} bg={themeTokens.surfaceCard} border={`1px solid ${themeTokens.borderSubtle}`}>
            <Text fontSize="sm" color={themeTokens.textMuted}>Reportagem</Text>
            <Heading size="md" color={themeTokens.textPrimary}>{validacao.reportagem}</Heading>
          </Box>
          <Box borderRadius="xl" p={4} bg={themeTokens.surfaceCard} border={`1px solid ${themeTokens.borderSubtle}`}>
            <Text fontSize="sm" color={themeTokens.textMuted}>Data de exibição</Text>
            <Heading size="md" color={themeTokens.textPrimary}>{validacao.data}</Heading>
          </Box>
          <Box borderRadius="xl" p={4} bg={themeTokens.surfaceCard} border={`1px solid ${themeTokens.borderSubtle}`}>
            <Text fontSize="sm" color={themeTokens.textMuted}>Status atual</Text>
            <Heading size="md" color={getStatusColor()}>{status}</Heading>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          {validacao.tracks.map((track, index) => (
            <TrackCard key={`${track.gMusicID}-${index}`} {...track} />
          ))}
        </SimpleGrid>

        <Flex direction={{ base: "column", lg: "row" }} gap={6} mt={10}>
          <Box flex={2} borderRadius="xl" bg={themeTokens.surfaceCard} border={`1px solid ${themeTokens.borderSubtle}`} p={5} boxShadow="md">
            <Text fontWeight="semibold" color={themeTokens.textPrimary}>
              Comentários internos
            </Text>
            <Textarea
              mt={3}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Adicione instruções ou feedback para a equipe..."
              bg={themeTokens.surfaceMuted}
              borderColor={themeTokens.borderSubtle}
            />
            <Flex justify="flex-end" mt={3}>
              <Button
                size="sm"
                bg={themeTokens.brandPrimary}
                color={themeTokens.brandOnPrimary}
                _hover={{ bg: themeTokens.brandPrimaryStrong }}
                isDisabled={!comentario.trim()}
              >
                Registrar comentário
              </Button>
            </Flex>
          </Box>

          <Box flex={1} borderRadius="xl" bg={themeTokens.surfaceCard} border={`1px solid ${themeTokens.borderSubtle}`} p={5} boxShadow="md">
            <Text fontWeight="semibold" color={themeTokens.textPrimary}>
              Atividade recente
            </Text>
            <VStack align="stretch" gap={4} mt={3}>
              {activity.map((entry) => (
                <Box key={entry.title}>
                  <Text fontWeight="medium" color={themeTokens.textPrimary}>
                    {entry.title}
                  </Text>
                  <Text fontSize="sm" color={themeTokens.textMuted}>
                    {entry.author}
                  </Text>
                  <Text fontSize="xs" color={themeTokens.textMuted}>
                    {entry.time}
                  </Text>
                  <Box h="1px" bg={themeTokens.borderSubtle} mt={2} />
                </Box>
              ))}
            </VStack>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
