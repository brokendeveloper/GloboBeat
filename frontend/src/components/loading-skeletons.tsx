"use client";

import {
  Box,
  Container,
  Flex,
  Skeleton,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";
import { themeTokens } from "@/constants/theme";

interface TrilhaListSkeletonProps {
  items?: number;
}

export function TrilhaListSkeleton({ items = 4 }: TrilhaListSkeletonProps) {
  return (
    <Box as="main" flex={1} bg={themeTokens.surfaceBg} py={{ base: 6, md: 12 }}>
      <Container maxW="6xl">
        <Stack gap={8}>
          <Skeleton height="32px" width={{ base: "60%", md: "280px" }} borderRadius="full" />

          <Box
            border="1px solid"
            borderColor={themeTokens.borderSubtle}
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
            bg={themeTokens.surfaceMuted}
          >
            <Stack direction={{ base: "column", md: "row" }} gap={4}>
              <Skeleton height="44px" flex={1} borderRadius="md" />
              <Skeleton height="44px" w={{ base: "100%", md: "160px" }} borderRadius="md" />
              <Skeleton height="44px" w={{ base: "100%", md: "110px" }} borderRadius="md" />
            </Stack>
          </Box>

          <Stack gap={4}>
            {Array.from({ length: items }).map((_, index) => (
              <Box
                key={`trilha-skeleton-${index}`}
                border="1px solid"
                borderColor={themeTokens.borderSubtle}
                borderRadius="lg"
                p={5}
                boxShadow="sm"
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  gap={4}
                >
                  <SkeletonText noOfLines={3} w="full" rootProps={{ gap: 2 }} />
                  <Skeleton height="28px" width="120px" borderRadius="full" />
                </Flex>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export function TrilhaDetalheSkeleton() {
  return (
    <Box as="main" flex={1} bg={themeTokens.surfaceBg} py={{ base: 6, md: 10 }}>
      <Container maxW="5xl">
        <Stack gap={6}>
          <Flex align="center" justify="space-between">
            <Skeleton height="32px" width="120px" borderRadius="full" />
            <Skeleton height="40px" width="150px" borderRadius="full" />
          </Flex>

          <Box
            border="1px solid"
            borderColor={themeTokens.borderSubtle}
            borderRadius="xl"
            p={{ base: 5, md: 8 }}
            bg={themeTokens.surfaceMuted}
          >
            <Stack gap={4}>
              <Skeleton height="28px" width="60%" />
              <SkeletonText noOfLines={2} width="40%" rootProps={{ gap: 3 }} />

              <Flex gap={4} direction={{ base: "column", md: "row" }}>
                <Skeleton height="90px" flex={1} borderRadius="lg" />
                <Skeleton height="90px" flex={1} borderRadius="lg" />
                <Skeleton height="90px" flex={1} borderRadius="lg" />
              </Flex>

              <Skeleton height="50px" width={{ base: "100%", md: "240px" }} borderRadius="md" />
            </Stack>
          </Box>

          <Stack gap={4}>
            {Array.from({ length: 2 }).map((_, index) => (
              <Box
                key={`track-skeleton-${index}`}
                border="1px solid"
                borderColor={themeTokens.borderSubtle}
                borderRadius="lg"
                p={5}
                bg={themeTokens.surfaceCard}
              >
                <SkeletonText noOfLines={4} rootProps={{ gap: 3 }} />
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export function DashboardSkeleton() {
  return (
    <Box as="main" flex={1} bg={themeTokens.surfaceBg} py={{ base: 6, md: 10 }} px={{ base: 4, md: 8 }}>
      <Stack gap={8} maxW="5xl" mx="auto">
        <Flex align="center" justify="space-between">
          <Skeleton height="36px" width="200px" />
          <Skeleton height="56px" width="56px" borderRadius="full" />
        </Flex>

        <Box bg={themeTokens.brandPrimary} borderRadius="xl" p={{ base: 4, md: 6 }}>
          <Skeleton height="28px" width="220px" mb={6} />
          <Stack gap={4}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Flex key={`dashboard-item-${index}`} justify="space-between" align="center">
                <Skeleton height="20px" width="60%" />
                <Skeleton height="20px" width="48px" />
              </Flex>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
