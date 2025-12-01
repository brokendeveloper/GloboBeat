import { Box, Container, Flex, Spinner, Text } from "@chakra-ui/react";

export function AppFallback() {
  return (
    <Box as="main" minH="100vh" bg="var(--brand-primary-strong)" color="white">
      <Container maxW="lg" py={32}>
        <Flex direction="column" align="center" gap={4} textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="whiteAlpha.200"
            color="white"
            size="xl"
          />
          <Text fontSize="lg" fontWeight="semibold">
            Carregando painel GloboBeat
          </Text>
          <Text fontSize="sm" color="whiteAlpha.700">
            Preparando dados e ajustes finais. Um instante…
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
