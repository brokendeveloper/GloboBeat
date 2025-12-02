"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  FileAudio, 
  FileVideo, 
  Music,
  CloudUpload,
  Sparkles,
  History,
  Settings,
  LogOut,
  Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files)
      setUploadStatus('idle')
      setUploadMessage('')
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      setSelectedFiles(e.dataTransfer.files)
      setUploadStatus('idle')
      setUploadMessage('')
    }
  }, [])

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadMessage('Por favor, selecione um arquivo primeiro')
      setUploadStatus('error')
      return
    }

    setUploadStatus('uploading')
    setUploadProgress(0)

    const file = selectedFiles[0]

    try {
      const formData = new FormData()
      formData.append('file', file)

      const progressInterval = setInterval(() => {
        setUploadProgress((prev: number) => Math.min(prev + 10, 90))
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
      setUploadMessage(`"${data.upload.filename}" enviado com sucesso!`)

      setTimeout(() => {
        setSelectedFiles(null)
        setUploadStatus('idle')
        setUploadProgress(0)
      }, 4000)

    } catch (error) {
      setUploadStatus('error')
      setUploadMessage(error instanceof Error ? error.message : 'Erro ao fazer upload')
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('audio/')) return <FileAudio className="w-5 h-5" />
    if (type.startsWith('video/')) return <FileVideo className="w-5 h-5" />
    return <FileAudio className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r flex flex-col">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">GloboBeat</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/page_upload"
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-accent text-accent-foreground font-medium"
          >
            <CloudUpload className="w-4 h-4" />
            Upload
          </Link>
          <Link 
            href="/trilha-identificada"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Trilhas Identificadas
          </Link>
          <Link 
            href="/validacao"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <History className="w-4 h-4" />
            Validação
          </Link>
        </nav>

        <Separator />
        <div className="p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="w-4 h-4" />
            Configurações
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold">Upload de Mídia</h1>
            <p className="text-sm text-muted-foreground">Envie arquivos de áudio ou vídeo</p>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <CloudUpload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Envie sua Reportagem</CardTitle>
                <CardDescription>
                  Identifique automaticamente as trilhas sonoras em seus conteúdos
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="space-y-2">
                    <Upload className={`w-8 h-8 mx-auto ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="font-medium">Arraste e solte seu arquivo aqui</p>
                    <p className="text-sm text-muted-foreground">
                      ou <span className="text-primary">clique para selecionar</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP3, WAV, MP4, MOV, AVI • Máximo 100MB
                    </p>
                  </div>
                </div>

                {/* Selected File */}
                {selectedFiles && selectedFiles.length > 0 && uploadStatus !== 'uploading' && (
                  <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {getFileIcon(selectedFiles[0].type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{selectedFiles[0].name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(selectedFiles[0].size)}</p>
                    </div>
                    <Button onClick={handleUpload}>
                      <Upload className="w-4 h-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                )}

                {/* Progress */}
                {uploadStatus === 'uploading' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Enviando...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {/* Success */}
                {uploadStatus === 'success' && (
                  <Alert>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertTitle>Upload concluído!</AlertTitle>
                    <AlertDescription>{uploadMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Error */}
                {uploadStatus === 'error' && (
                  <Alert variant="destructive">
                    <XCircle className="w-4 h-4" />
                    <AlertTitle>Erro no upload</AlertTitle>
                    <AlertDescription>{uploadMessage}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <FileAudio className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-medium text-sm">Áudio</h3>
                <p className="text-xs text-muted-foreground mt-1">MP3, WAV, AAC, OGG</p>
              </Card>
              <Card className="p-4">
                <FileVideo className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-medium text-sm">Vídeo</h3>
                <p className="text-xs text-muted-foreground mt-1">MP4, MOV, AVI, WebM</p>
              </Card>
              <Card className="p-4">
                <Sparkles className="w-5 h-5 text-destructive mb-2" />
                <h3 className="font-medium text-sm">Identificação</h3>
                <p className="text-xs text-muted-foreground mt-1">ACRCloud, AcoustID</p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
