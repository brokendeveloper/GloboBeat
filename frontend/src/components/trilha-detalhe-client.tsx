"use client";

import TrackCard from "@/components/CardTrilha";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { FileDown } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { statusColor, type TrilhaStatus } from "@/features/trilhas/types";
import { trilhaDetalhesMap } from "@/features/trilhas/data";
import { BackLink } from "@/components/back-link";
import { themeTokens } from "@/constants/theme";
import { ReportagemVideoPanel } from "@/components/reportagem-video-panel";
import { getReportagemVideo } from "@/constants/media";

interface TrilhaDetalheClientProps {
  id: string;
}

export function TrilhaDetalheClient({ id }: TrilhaDetalheClientProps) {
  const trilha = trilhaDetalhesMap[id] || trilhaDetalhesMap["1"];
  const video = getReportagemVideo(trilha.id);

  const [status, setStatus] = useState<TrilhaStatus>(trilha.status);
  const [acaoSelecionada, setAcaoSelecionada] = useState<"" | "confirmar" | "negar">(() => {
    if (trilha.status === "Identificada") return "confirmar";
    if (trilha.status === "Revisão Necessária") return "negar";
    return "";
  });

  const handleSelectAcao = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as "" | "confirmar" | "negar";
    setAcaoSelecionada(value);

    if (value === "confirmar") {
      setStatus("Identificada");
      return;
    }

    if (value === "negar") {
      setStatus("Revisão Necessária");
      return;
    }

    setStatus(trilha.status);
  };

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
          <Text color={themeTokens.textMuted}>{trilha.data} • {trilha.editoria}</Text>
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

          <select
            value={acaoSelecionada}
            onChange={handleSelectAcao}
            style={{
              width: "220px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: `2px solid ${themeTokens.borderSubtle}`,
              backgroundColor: "var(--surface-card)",
              color: themeTokens.textPrimary as string,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="">Selecione uma ação</option>
            <option value="confirmar">Confirmar trilha</option>
            <option value="negar">Negar trilha</option>
          </select>
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
          ]}
        />
      </Box>

      <VStack gap={4} maxW="700px" mx="auto">
        {trilha.tracks.map((track, index) => (
          <TrackCard key={`${track.gMusicID}-${index}`} {...track} />
        ))}
      </VStack>

      <Flex justify="center" mt={8}>
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
    </Box>
  );
}
