"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AuthLayout } from "@/components/auth-layout";
import { StatusMessage } from "@/components/status-message";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setStatus("error");
      setMessage("As senhas precisam ser idênticas para liberar o acesso.");
      return;
    }
    if (!aceitouTermos) {
      setStatus("error");
      setMessage("É necessário aceitar os termos de uso da Globo.");
      return;
    }

    setStatus("success");
    setMessage("Solicitação enviada ao time de segurança. Responderemos em até 24h.");
  };

  return (
    <AuthLayout
      title="Solicitar acesso"
      subtitle="Cadastre-se para habilitar o monitoramento de trilhas no seu núcleo."
      switchAccount={{
        question: "Já possui credenciais?",
        actionLabel: "Fazer login",
        href: "/login",
      }}
      highlight={{
        eyebrow: "credenciamento interno",
        headline: "Uso exclusivo para redações Globo",
        description:
          "O cadastro passa por aprovação do time de Rights & Clearance garantindo segurança e governança.",
        stats: [
          { label: "Editorias integradas", value: "12" },
          { label: "Usuários ativos", value: "350+" },
        ],
      }}
      footerNote={
        <Text fontSize="sm">
          Dúvidas? Procure a equipe de Segurança de Conteúdo ou acesse a Central de Suporte.
        </Text>
      }
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={5}>
          <Box>
            <Text fontWeight="medium" mb={2}>
              Nome completo
            </Text>
            <Input
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Nome e sobrenome"
              size="lg"
              borderRadius="xl"
              required
            />
          </Box>

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

          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Box flex="1">
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
            </Box>
            <Box flex="1">
              <Text fontWeight="medium" mb={2}>
                Confirmar senha
              </Text>
              <Input
                type="password"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                size="lg"
                borderRadius="xl"
                required
              />
            </Box>
          </Stack>

          <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.95rem" }}>
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(event) => setAceitouTermos(event.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                marginTop: "4px",
              }}
            />
            <span>Declaro que li e concordo com os termos internos de confidencialidade.</span>
          </label>

          <StatusMessage status={status} message={message} />

          <Button
            type="submit"
            size="lg"
            borderRadius="xl"
            bg="var(--brand-primary)"
            color="white"
            _hover={{ bg: "var(--brand-primary-strong)" }}
          >
            Enviar solicitação
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
