import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { themeTokens } from "@/constants/theme";

export interface Track {
  nome: string;
  album: string;
  banda: string;
  timestamp: string;
  politica: string;
  gMusicID: string;
}

export default function TrackCard(props: Track) {
  return (
    <Box
      bgGradient={themeTokens.brandGradient}
      p={6}
      rounded="2xl"
      color={themeTokens.brandOnPrimary}
      w="full"
      boxShadow="0 15px 45px rgba(5,83,113,0.25)"
    >
      <VStack align="stretch" gap={3} fontSize="sm">
        <Flex justify="space-between" align="center">
          <Text fontWeight="bold" fontSize="lg">
            {props.nome}
          </Text>
          <Text fontSize="xs" opacity={0.85}>
            #{props.gMusicID}
          </Text>
        </Flex>

        <Text opacity={0.85}>
          {props.album} • {props.banda}
        </Text>

        <Flex gap={2} flexWrap="wrap">
          <Box
            px={3}
            py={1}
            borderRadius="full"
            bg="rgba(255,255,255,0.15)"
            fontSize="xs"
          >
            {props.timestamp}
          </Box>
          <Box
            px={3}
            py={1}
            borderRadius="full"
            bg="rgba(255,255,255,0.15)"
            fontSize="xs"
          >
            Política: {props.politica}
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
}
