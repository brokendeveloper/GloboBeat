"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Box, Button, Input, Text, VStack, Flex, Checkbox } from "@chakra-ui/react"
import {Field} from '@/components/ui/field'

export default function CadastroPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [aceitouTermos, setAceitouTermos] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!")
      return
    }

    if (!aceitouTermos) {
      alert("Você precisa aceitar os termos de uso!")
      return
    }

    console.log("Cadastro:", { nome, email, senha })
  }

  return (
    <div className="min-h-screen m-0 p-0 bg-gradient-to-b from-[#055371] to-[#001821] bg-fixed text-foreground">
      <Flex direction="column" minH="100vh">
        <Box as="header" w="full" px={8} py={6}>
          <Flex align="center" justify="space-between">
            <Box flex={1} />
            <Flex flex={1} justify="center">
              <Image src="/logo.png" alt="Logo" width={60} height={60} style={{ objectFit: "contain" }} />
            </Flex>
            <Flex flex={1} justify="flex-end" gap={3}>
              <Link href="/login">
                <Button bg="white" color="#055371" borderRadius="full" fontWeight="medium" _hover={{ bg: "gray.100" }}>
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button variant="ghost" color="white" fontWeight="medium" _hover={{ opacity: 0.8 }}>
                  Registre-se
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Box>

        <Flex as="main" flex={1} align="center" justify="center" px={4} py={8}>
          <Box
            w="full"
            maxW="md"
            bg="whiteAlpha.200"
            backdropFilter="blur(8px)"
            border="2px solid"
            borderColor="whiteAlpha.300"
            borderRadius="2xl"
            p={8}
          >
            <Text fontSize="4xl" fontWeight="bold" color="white" textAlign="center" mb={8}>
              Cadastro
            </Text>

            <form onSubmit={handleSubmit}>
              <VStack gap={5} align="stretch">
                <Field label="Nome:" color="white">
                  <Input
                    type="text"
                    value={nome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                    bg="whiteAlpha.900"
                    color="gray.800"
                    borderRadius="lg"
                    size="lg"
                    required
                    _focus={{ ring: 2, ringColor: "whiteAlpha.500" }}
                  />
                </Field>

                <Field label="Email:" color="white">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    bg="whiteAlpha.900"
                    color="gray.800"
                    borderRadius="lg"
                    size="lg"
                    required
                    _focus={{ ring: 2, ringColor: "whiteAlpha.500" }}
                  />
                </Field>

                <Field label="Senha:" color="white">
                  <Input
                    type="password"
                    value={senha}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                    bg="whiteAlpha.900"
                    color="gray.800"
                    borderRadius="lg"
                    size="lg"
                    required
                    _focus={{ ring: 2, ringColor: "whiteAlpha.500" }}
                  />
                </Field>

                <Field label="Confirmar senha:" color="white">
                  <Input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmarSenha(e.target.value)}
                    bg="whiteAlpha.900"
                    color="gray.800"
                    borderRadius="lg"
                    size="lg"
                    required
                    _focus={{ ring: 2, ringColor: "whiteAlpha.500" }}
                  />
                </Field>

                <Flex align="center" gap={2} pt={2}>
                  <Checkbox.Root
                    checked={aceitouTermos}
                    onCheckedChange={(details) => setAceitouTermos(details.checked as boolean)}
                    colorPalette="teal"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label color="white" fontSize="sm">
                      Confirmar termos de uso.
                    </Checkbox.Label>
                  </Checkbox.Root>
                </Flex>

                <Flex justify="center" pt={4}>
                  <Button
                    type="submit"
                    bg="#055371"
                    color="white"
                    px={12}
                    py={6}
                    borderRadius="lg"
                    fontWeight="semibold"
                    _hover={{ bg: "#044560" }}
                  >
                    Cadastrar
                  </Button>
                </Flex>
              </VStack>
            </form>
          </Box>
        </Flex>

        <Box as="footer" w="full" py={8}>
          <Flex justify="center">
            <Text fontSize="4xl" fontWeight="bold" color="white" letterSpacing="wider">
              GLOBOBEAT
            </Text>
          </Flex>
        </Box>
      </Flex>
    </div>

  )
}
