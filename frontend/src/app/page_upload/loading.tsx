import { Box, Flex, Skeleton, Stack } from "@chakra-ui/react";
import { themeTokens } from "@/constants/theme";

export default function Loading() {
  return (
    <Flex as="main" flex={1} align="center" justify="center" px={4} py={8} bg={themeTokens.surfaceBg}>
      <Box
        w="full"
        maxW="2xl"
        bgGradient={themeTokens.panelGradient}
        border="1px solid"
        borderColor={themeTokens.borderSubtle}
        borderRadius="2xl"
        p={{ base: 8, md: 12 }}
        boxShadow="2xl"
      >
        <Stack gap={6}>
          <Skeleton height="32px" width="70%" borderRadius="full" mx="auto" />
          <Skeleton height="18px" width="85%" borderRadius="full" mx="auto" />
          <Skeleton height="220px" borderRadius="xl" />
          <Skeleton height="48px" borderRadius="full" />
        </Stack>
      </Box>
    </Flex>
  );
}
