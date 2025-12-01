import { Box, Flex, Text } from "@chakra-ui/react";
import { Film, Play } from "lucide-react";
import { type ReportagemVideo } from "@/constants/media";
import { themeTokens } from "@/constants/theme";

interface MetadataItem {
  label: string;
  value: string;
}

interface ReportagemVideoPanelProps {
  title: string;
  video: ReportagemVideo;
  highlightLabel?: string;
  metadata?: MetadataItem[];
}

export function ReportagemVideoPanel({
  title,
  video,
  highlightLabel = "Trecho oficial",
  metadata = [],
}: ReportagemVideoPanelProps) {
  const baseMetadata: MetadataItem[] = [
    { label: "Duração", value: video.duration },
    { label: "Captado em", value: video.recordedAt },
    { label: "Local", value: video.location },
    ...metadata,
  ];

  return (
    <Box
      borderRadius="2xl"
      bg={themeTokens.surfaceCard}
      border={`1px solid ${themeTokens.borderSubtle}`}
      boxShadow="0 12px 40px rgba(5, 83, 113, 0.08)"
      p={{ base: 4, md: 6 }}
      w="full"
    >
      <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
        <Box>
          <Flex align="center" gap={2} color={themeTokens.textMuted} mb={1}>
            <Film size={16} />
            <Text fontSize="sm" fontWeight={500}>
              {highlightLabel}
            </Text>
          </Flex>
          <Text fontSize="xl" fontWeight="bold" color={themeTokens.textPrimary}>
            {title}
          </Text>
          <Text fontSize="sm" color={themeTokens.textMuted}>
            {video.description}
          </Text>
        </Box>

        <Box
          px={4}
          py={1.5}
          borderRadius="full"
          bg={themeTokens.surfaceMuted}
          color={themeTokens.textPrimary}
          fontWeight="semibold"
          fontSize="sm"
          display="inline-flex"
          alignItems="center"
          gap={2}
        >
          <Play size={14} />
          Visualizar
        </Box>
      </Flex>

      <Box
        mt={5}
        borderRadius="xl"
        overflow="hidden"
        border={`1px solid ${themeTokens.borderSubtle}`}
        boxShadow="0 10px 40px rgba(0,0,0,0.18)"
      >
        <video
          controls
          preload="metadata"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
          }}
        >
          <source src={video.url} type="video/mp4" />
          Seu navegador não suporta a reprodução de vídeos.
        </video>
      </Box>

      <Flex
        gap={3}
        mt={5}
        flexWrap="wrap"
        borderTop={`1px solid ${themeTokens.borderSubtle}`}
        pt={4}
      >
        {baseMetadata.map((item) => (
          <Box
            key={`${item.label}-${item.value}`}
            px={4}
            py={2}
            borderRadius="lg"
            bg={themeTokens.surfaceMuted}
            minW="140px"
          >
            <Text fontSize="xs" color={themeTokens.textMuted} textTransform="uppercase" letterSpacing="0.08em">
              {item.label}
            </Text>
            <Text fontWeight="semibold" color={themeTokens.textPrimary}>
              {item.value}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
