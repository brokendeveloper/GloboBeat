"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Box, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import { UploadCloud, X } from "lucide-react";

export default function DashboardPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      return;
    }

    clearPreview();
    const objectUrl = URL.createObjectURL(firstFile);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveFile = () => {
    clearPreview();
    setSelectedFiles(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
      <Flex as="main" flex={1} align="center" justify="center" px={4} py={8}>
        <Box
          w="full"
          maxW="2xl"
          bg="white"
          borderRadius="2xl"
          p={{ base: 8, md: 12 }}
          boxShadow="2xl"
        >
          <VStack gap={6} align="stretch">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="#055371"
              textAlign="center"
            >
              Faça upload da sua reportagem
            </Text>

            <Text
              fontSize="sm"
              color="gray.600"
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
                borderColor="gray.300"
                bg="gray.50"
                borderRadius="xl"
                p={{ base: 6, md: 8 }}
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{ borderColor: "#055371" }}
              >
                <VStack gap={3}>
                  <Flex
                    align="center"
                    justify="center"
                    w="64px"
                    h="64px"
                    borderRadius="full"
                    bg="white"
                    boxShadow="sm"
                    mx="auto"
                  >
                    <UploadCloud size={28} color="#055371" />
                  </Flex>
                  <Text fontWeight="semibold" color="#055371">
                    Clique ou arraste para enviar seu vídeo
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Aceitamos MP4, MOV, MKV com até 2GB
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    ou arraste o arquivo para esta área
                  </Text>
                </VStack>
              </Box>
            )}

            {selectedVideo && (
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
                p={5}
                bg="white"
                boxShadow="lg"
              >
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  gap={4}
                >
                  <Box>
                    <Text color="#055371" fontWeight="bold">
                      {selectedVideo.name}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      {formatFileSize(selectedVideo.size)} •{" "}
                      {selectedVideo.type || "Vídeo"}
                    </Text>
                  </Box>
                  <IconButton
                    aria-label="Remover vídeo"
                    onClick={handleRemoveFile}
                    size="sm"
                    variant="ghost"
                    color="#C53030"
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
          </VStack>
        </Box>
      </Flex>
    </>
  );
}
