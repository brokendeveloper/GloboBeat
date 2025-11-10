"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Box, Button, Flex, Text, VStack, Alert } from "@chakra-ui/react"
import { Sidebar } from "@/components/sidebar"
import { Search, User, Upload, CheckCircle, XCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export default function DashboardPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files)
      setUploadStatus('idle')
      setUploadMessage('')
      console.log("Arquivos selecionados:", e.target.files)
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadMessage('Por favor, selecione um arquivo primeiro')
      setUploadStatus('error')
      return
    }

    setUploadStatus('uploading')
    setUploadProgress(0)

    const file = selectedFiles[0] // Upload first file

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao fazer upload')
      }

      const data = await response.json()

      setUploadStatus('success')
      setUploadMessage(`Arquivo "${data.upload.filename}" enviado com sucesso!`)
      console.log('Upload realizado:', data)

      // Reset after 3 seconds
      setTimeout(() => {
        setSelectedFiles(null)
        setUploadStatus('idle')
        setUploadProgress(0)
      }, 3000)

    } catch (error) {
      console.error('Erro no upload:', error)
      setUploadStatus('error')
      setUploadMessage(error instanceof Error ? error.message : 'Erro ao fazer upload do arquivo')
      setUploadProgress(0)
    }
  }

  return (
    <Sidebar>
      <Flex direction="column" minH="100vh">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <Flex as="main" flex={1} align="center" justify="center" px={4} py={8}>
          <Box w="full" maxW="2xl" bg="white" borderRadius="xl" p={12} boxShadow="lg">
            <VStack gap={6} align="stretch">
              <Text fontSize="2xl" fontWeight="bold" color="#055371" textAlign="center">
                Faça upload da sua reportagem
              </Text>

              <Text fontSize="sm" color="gray.600" textAlign="center" lineHeight="relaxed">
                Verifique os direitos autorais das suas músicas de forma simples e prática! Descubra rapidamente se uma
                faixa possui registro, proteção legal ou restrições de uso. Você pode consultar, comparar e organizar
                suas músicas da maneira que preferir. Tudo rápido, fácil e sem complicação!
              </Text>

              <Flex justify="center" mt={4}>
                <Box position="relative">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileSelect}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    style={{
                      display: "inline-block",
                      backgroundColor: "#055371",
                      color: "white",
                      padding: "12px 32px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#044560"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#055371"
                    }}
                  >
                    Selecionar arquivos
                  </label>
                </Box>
              </Flex>

              {selectedFiles && selectedFiles.length > 0 && (
                <VStack gap={3} mt={4}>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    {selectedFiles.length} arquivo(s) selecionado(s)
                  </Text>
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    {selectedFiles[0].name}
                  </Text>

                  <Button
                    onClick={handleUpload}
                    colorScheme="blue"
                    bg="#055371"
                    _hover={{ bg: "#044560" }}
                    isLoading={uploadStatus === 'uploading'}
                    loadingText="Enviando..."
                    leftIcon={<Upload size={18} />}
                  >
                    Fazer Upload
                  </Button>
                </VStack>
              )}

              {uploadStatus === 'uploading' && (
                <Box mt={4}>
                  <Text fontSize="sm" color="gray.600" mb={2} textAlign="center">
                    Enviando arquivo... {uploadProgress}%
                  </Text>
                  <Box
                    width="100%"
                    height="8px"
                    bg="gray.200"
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <Box
                      height="100%"
                      width={`${uploadProgress}%`}
                      bg="blue.500"
                      transition="width 0.3s ease"
                    />
                  </Box>
                </Box>
              )}

              {uploadStatus === 'success' && (
                <Alert.Root status="success" mt={4} borderRadius="md">
                  <CheckCircle size={18} />
                  <Alert.Title fontSize="sm" ml={2}>{uploadMessage}</Alert.Title>
                </Alert.Root>
              )}

              {uploadStatus === 'error' && (
                <Alert.Root status="error" mt={4} borderRadius="md">
                  <XCircle size={18} />
                  <Alert.Title fontSize="sm" ml={2}>{uploadMessage}</Alert.Title>
                </Alert.Root>
              )}

              {uploadStatus === 'idle' && (
                <Text fontSize="xs" color="gray.400" textAlign="center" mt={2}>
                  Arraste e solte arquivos ou clique para selecionar
                </Text>
              )}
            </VStack>
          </Box>
        </Flex>

        {/* Footer */}
        <Footer />
      </Flex>
    </Sidebar>
  )
}
