"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { themeTokens } from "@/constants/theme";

interface StatusMessageProps {
  status: "idle" | "success" | "error" | "info";
  message?: string | null;
}

const backgroundByStatus: Record<Exclude<StatusMessageProps["status"], "idle">, string> = {
  success: "rgba(0, 168, 84, 0.12)",
  error: "rgba(255, 71, 87, 0.12)",
  info: "rgba(5, 83, 113, 0.12)",
};

const colorByStatus: Record<Exclude<StatusMessageProps["status"], "idle">, string> = {
  success: themeTokens.statusSuccess,
  error: themeTokens.statusError,
  info: themeTokens.brandPrimary,
};

export function StatusMessage({ status, message }: StatusMessageProps) {
  if (!message || status === "idle") {
    return <Box aria-live="polite" minH="40px" />;
  }

  const bg = backgroundByStatus[status] ?? backgroundByStatus.info;
  const color = colorByStatus[status] ?? colorByStatus.info;

  return (
    <Flex
      aria-live="polite"
      align="flex-start"
      gap={3}
      borderRadius="lg"
      border="1px solid"
      borderColor={color}
      bg={bg}
      color={color}
      px={4}
      py={3}
    >
      <Box w="12px" h="12px" borderRadius="full" bg={color} mt={1.5} flexShrink={0} />
      <Text fontWeight="medium">{message}</Text>
    </Flex>
  );
}
