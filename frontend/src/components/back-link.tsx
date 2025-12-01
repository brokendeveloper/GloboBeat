"use client";

import Link from "next/link";
import { Flex, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { themeTokens } from "@/constants/theme";

interface BackLinkProps {
  href: string;
  label?: string;
  color?: string;
}

export function BackLink({
  href,
  label = "Voltar",
  color = themeTokens.brandPrimary,
}: BackLinkProps) {
  return (
    <Link href={href}>
      <Flex
        align="center"
        gap={3}
        color={color}
        fontWeight="semibold"
        cursor="pointer"
        _hover={{ color: themeTokens.brandPrimaryStrong }}
      >
        <Flex
          align="center"
          justify="center"
          w="32px"
          h="32px"
          bg={color}
          borderRadius="full"
        >
          <ArrowLeft size={18} color={themeTokens.brandOnPrimary} />
        </Flex>
        <Text>{label}</Text>
      </Flex>
    </Link>
  );
}
