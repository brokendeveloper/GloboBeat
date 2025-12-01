"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import { UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { themeTokens } from "@/constants/theme";
import { useUploadTrilha } from "@/features/trilhas/hooks";
import { StatusMessage } from "@/components/status-message";

export default function DashboardPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { uploadState, uploadTrilha, resetUploadState, setUploadError } = useUploadTrilha({
    onSuccess: (response) => {
      setTimeout(() => {
        router.push(
          `/trilha-identificada/${response.trilhaId}?requestId=${response.requestId}`
        );
      }, 400);
    },
  });

  const selectedVideo = selectedFiles?.[0] ?? null;

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);
    resetUploadState();

    if (!files || files.length === 0) {
      clearPreview();
      return;
    }

    const firstFile = files[0];
    const isVideo = firstFile.type.startsWith("video/");

    if (!isVideo) {
      clearPreview();
      e.target.value = "";
      setSelectedFiles(null);
      resetUploadState();
      setUploadError("Apenas arquivos de vídeo (MP4, MOV, MKV) são aceitos.");
      return;
    }

    clearPreview();
    const objectUrl = URL.createObjectURL(firstFile);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveFile = () => {
    clearPreview();
    setSelectedFiles(null);
    resetUploadState();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUploadVideo = async () => {
    await uploadTrilha(selectedVideo);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
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
          <VStack gap={6} align="stretch">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={themeTokens.textPrimary}
              textAlign="center"
            >
              Faça upload da sua reportagem
            </Text>

            <Text
              fontSize="sm"
              color={themeTokens.textMuted}
              textAlign="center"
              lineHeight="relaxed"
            >
              Verifique os direitos autorais das suas músicas de forma simples e
              prática! Envie o arquivo de vídeo para que possamos analisar os
              trechos musicais automaticamente.
            </Text>

            <input
              ref={inputRef}
              type="file"
              id="file-upload"
              multiple
              accept="video/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            {!selectedVideo && (
              <Box
                as="label"
                htmlFor="file-upload"
                border="2px dashed"
                borderColor={themeTokens.borderSubtle}
                bg={themeTokens.surfaceMuted}
                borderRadius="xl"
                p={{ base: 6, md: 8 }}
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{ borderColor: themeTokens.brandPrimary }}
              >
                <VStack gap={3}>
                  <Flex
                    align="center"
                    justify="center"
                    w="64px"
                    h="64px"
                    borderRadius="full"
                    bg={themeTokens.surfaceCard}
                    boxShadow="sm"
                    mx="auto"
                  >
                    <UploadCloud size={28} color="var(--brand-primary)" />
                  </Flex>
                  <Text fontWeight="semibold" color={themeTokens.textPrimary}>
                    Clique ou arraste para enviar seu vídeo
                  </Text>
                  <Text fontSize="sm" color={themeTokens.textMuted}>
                    Aceitamos MP4, MOV, MKV com até 2GB
                  </Text>
                  <Text fontSize="xs" color={themeTokens.textMuted}>
                    ou arraste o arquivo para esta área
                  </Text>
                </VStack>
              </Box>
            )}

            {selectedVideo && (
              <Box
                border="1px solid"
                borderColor={themeTokens.borderSubtle}
                borderRadius="xl"
                p={5}
                bg={themeTokens.surfaceMuted}
                boxShadow="lg"
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  gap={4}
                >
                  <Box>
                    <Text color={themeTokens.textPrimary} fontWeight="bold">
                      {selectedVideo.name}
                    </Text>
                    <Text color={themeTokens.textMuted} fontSize="sm">
                      {formatFileSize(selectedVideo.size)} •{" "}
                      {selectedVideo.type || "Vídeo"}
                    </Text>
                  </Box>
                  <IconButton
                    aria-label="Remover vídeo"
                    onClick={handleRemoveFile}
                    size="sm"
                    variant="ghost"
                    color={themeTokens.statusError}
                  >
                    <X size={18} />
                  </IconButton>
                </Flex>

                {previewUrl && (
                  <Box
                    mt={4}
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    bg="black"
                  >
                    <video
                      src={previewUrl}
                      controls
                      style={{ width: "100%", maxHeight: "380px" }}
                    />
                  </Box>
                )}
              </Box>
            )}

            <Button
              onClick={handleUploadVideo}
              isDisabled={!selectedVideo || uploadState.status === "uploading"}
              isLoading={uploadState.status === "uploading"}
              loadingText="Enviando vídeo"
              bg={themeTokens.brandPrimary}
              color={themeTokens.brandOnPrimary}
              borderRadius="lg"
              py={6}
              fontSize="lg"
            >
              {uploadState.requestId && uploadState.status === "success"
                ? "Processando trilhas..."
                : "Enviar vídeo para análise"}
            </Button>

            <StatusMessage
              status={
                uploadState.status === "error"
                  ? "error"
                  : uploadState.status === "success"
                  ? "success"
                  : "idle"
              }
              message={
                uploadState.status === "success" && uploadState.requestId
                  ? "Upload concluído! Estamos redirecionando para as trilhas identificadas."
                  : uploadState.errorMessage
              }
            />
          </VStack>
        </Box>
      </Flex>
    </>
  );
}
