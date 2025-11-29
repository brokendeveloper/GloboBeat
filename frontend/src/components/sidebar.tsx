"use client";

import Link from "next/link";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Histórico", href: "/historico" },
  { label: "Validação", href: "/validacao" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="blackAlpha.400"
          backdropFilter="blur(6px)"
          zIndex={900}
          onClick={onClose}
        />
      )}

      <Box
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w="260px"
        bg="#055371"
        borderRight="2px solid"
        borderColor="whiteAlpha.300"
        transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
        transition="transform 0.3s ease"
        zIndex={1000}
        display="flex"
        flexDirection="column"
        p={4}
      >
        <Flex justify="flex-end">
          <IconButton
            aria-label="Fechar menu"
            onClick={onClose}
            variant="ghost"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
            size="sm"
          >
            <X size={20} />
          </IconButton>
        </Flex>

        <Flex direction="column" gap={3} mt={8}>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Box
                px={4}
                py={3}
                borderRadius="md"
                color="white"
                fontWeight="medium"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={onClose}
              >
                <Text>{item.label}</Text>
              </Box>
            </Link>
          ))}
        </Flex>
      </Box>
    </>
  );
}
