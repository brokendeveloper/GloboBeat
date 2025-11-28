"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Box, Flex, Text, IconButton } from "@chakra-ui/react"
import { Menu, X } from "lucide-react"

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  const menuItems = [
    { label: "Histórico", href: "/historico" },
    { label: "Validação", href: "/validacao" },
    { label: "Dashboard", href: "/dashboard" },
  ]

  return (
    <Box position="relative" minH="100vh">
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
          onClick={closeMenu}
        />
      )}
      {/* Sidebar */}
      <Box
        position="fixed"
        left={0}
        top={0}
        h="100vh"
        w={isOpen ? "250px" : "60px"}
        bg="#055371"
        transition="width 0.3s ease"
        zIndex={1000}
        borderRight="2px solid"
        borderColor="whiteAlpha.300"
      >
        {/* Toggle Button */}
        <Flex justify={isOpen ? "flex-end" : "center"} p={4}>
          <IconButton
            aria-label="Toggle menu"
            onClick={() => setIsOpen(!isOpen)}
            bg="transparent"
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
            size="sm"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </IconButton>
        </Flex>

        {/* Menu Items */}
        <Flex direction="column" gap={2} px={3} mt={8}>
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
                overflow="hidden"
                whiteSpace="nowrap"
                onClick={closeMenu}
              >
                <Text opacity={isOpen ? 1 : 0} transition="opacity 0.2s">
                  {item.label}
                </Text>
              </Box>
            </Link>
          ))}
        </Flex>
      </Box>

      {/* Main Content */}
      <Box
        // Remove margin and width adjustments
        ml="0"
        w="100%"
        transition="all 0.3s ease"
      >
        {children}
      </Box>
    </Box>
  )
}
