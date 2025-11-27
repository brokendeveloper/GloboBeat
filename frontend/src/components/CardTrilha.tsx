import { Box, Text, VStack } from "@chakra-ui/react";

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
    <Box bg="#055371" p={5} rounded="md" color="white" w="full">
      <VStack align="stretch" gap={2}>
        <Text>
          <strong>Nome:</strong> {props.nome}
        </Text>
        <Text>
          <strong>Álbum:</strong> {props.album}
        </Text>
        <Text>
          <strong>Banda:</strong> {props.banda}
        </Text>
        <Text>
          <strong>Timestamp:</strong> {props.timestamp}
        </Text>
        <Text>
          <strong>Política:</strong> {props.politica}
        </Text>
        <Text>
          <strong>G music ID:</strong> {props.gMusicID}
        </Text>
      </VStack>
    </Box>
  );
}
