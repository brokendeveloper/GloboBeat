import TrackCard, { type Track } from "@/components/CardTrilha";
import { Box, Flex, Heading, Text, SimpleGrid, Button } from "@chakra-ui/react";
import { BackLink } from "@/components/back-link";
import { themeTokens } from "@/constants/theme";
import { FileDown } from "lucide-react";
import { ReportagemVideoPanel } from "@/components/reportagem-video-panel";
import { getReportagemVideo } from "@/constants/media";

interface Resultado {
  id: string;
  track: Track;
}

// Mock data based on the image
const mockResultado: Resultado = {
  id: "1",
  track: {
    nome: "Oceano",
    album: "Oceano",
    banda: "Djavan",
    timestamp: "00:23 - 01:00",
    politica: "(Não encontrado/ restrita/ livre)",
    gMusicID: "XXXXXXXXXX",
  },
};

interface ResultadoDetalhadoPageProps {
  params: { id: string };
}

export default function ResultadoDetalhadoPage({ params }: ResultadoDetalhadoPageProps) {
  const { id } = params;
  const resultado = mockResultado;
  const track = resultado.track;
  const video = getReportagemVideo(id);

  return (
    <>
      <Box as="main" flex={1} bg={themeTokens.surfaceBg} p={8}>
        <Flex align="center" justify="space-between" mb={8}>
          <BackLink href="/resultados" />
          <Box textAlign="center" flex={1}>
            <Text fontSize="sm" color={themeTokens.textMuted}>
              Resultado analisado
            </Text>
            <Heading as="h1" size="lg" color={themeTokens.textPrimary}>
              {`${track.nome} • ${track.banda}`}
            </Heading>
            <Text color={themeTokens.textMuted}>{track.album}</Text>
          </Box>
          <Button
            leftIcon={<FileDown size={16} />}
            bg={themeTokens.brandPrimary}
            color={themeTokens.brandOnPrimary}
            borderRadius="full"
            _hover={{ bg: themeTokens.brandPrimaryStrong }}
          >
            Exportar
          </Button>
        </Flex>

        <Box maxW="900px" mx="auto" mb={8}>
          <ReportagemVideoPanel
            title="Trecho identificado"
            video={video}
            metadata={[
              { label: "Faixa", value: track.nome },
              { label: "Programa", value: "Manhã Globo" },
              { label: "Timestamp", value: track.timestamp },
            ]}
          />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} maxW="900px" mx="auto">
          <TrackCard {...track} />
          <Box borderRadius="2xl" bg={themeTokens.surfaceCard} border={`1px solid ${themeTokens.borderSubtle}`} p={5} boxShadow="lg">
            <Text fontWeight="semibold" color={themeTokens.textPrimary}>
              Insight de detecção
            </Text>
            <Text color={themeTokens.textMuted} mt={2}>
              Trilha encontrada em 78% das gravações com alto grau de confiança. Verifique política antes de reutilizar.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
}
