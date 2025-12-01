"use client";

import type React from "react";
import NextLink from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AuthLayout } from "@/components/auth-layout";
import { StatusMessage } from "@/components/status-message";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !senha) {
      setStatus("error");
      setErrorMessage("Informe o e-mail corporativo e a senha de acesso.");
      return;
    }
    setStatus("success");
    setErrorMessage(null);
    setTimeout(() => {
      router.push("/page_upload");
    }, 400);
  };

  return (
    <AuthLayout
      title="Acesso GloboBeat"
      subtitle="Valide reportagens e monitore trilhas com segurança corporativa."
      switchAccount={{
        question: "Ainda não tem credenciais?",
        actionLabel: "Solicitar acesso",
        href: "/cadastro",
      }}
      highlight={{
        eyebrow: "plataforma homologada",
        headline: "Monitoramento 24h das trilhas Globo",
        description:
          "Integrado ao pipeline de rights clearance para manter suas reportagens prontas para ir ao ar.",
        stats: [
          { label: "Reportagens validadas", value: "1.280+" },
          { label: "Tempo médio de aprovação", value: "58min" },
        ],
      }}
      footerNote={
        <Text fontSize="sm">
          Ao prosseguir você concorda com os termos internos de uso e confidencialidade.
        </Text>
      }
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={5}>
          <Box>
            <Text fontWeight="medium" mb={2}>
              E-mail corporativo
            </Text>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nome.sobrenome@globo.com"
              size="lg"
              borderRadius="xl"
              required
            />
          </Box>

          <Box>
            <Text fontWeight="medium" mb={2}>
              Senha
            </Text>
            <Input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              size="lg"
              borderRadius="xl"
              required
            />
            <Flex justify="flex-end" mt={2}>
              <Link as={NextLink} href="/recuperar" color="var(--brand-primary)" fontSize="sm">
                Esqueci minha senha
              </Link>
            </Flex>
          </Box>

          <StatusMessage status={status} message={errorMessage} />

          <Button
            type="submit"
            size="lg"
            borderRadius="xl"
            bg="var(--brand-primary)"
            color="white"
            _hover={{ bg: "var(--brand-primary-strong)" }}
          >
            Entrar
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
