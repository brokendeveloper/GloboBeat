"use client"

import { useState, useRef } from "react"
import { 
  CloudUpload, 
  Upload, 
  FileAudio, 
  FileVideo, 
  Sparkles,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      setSelectedFiles(e.dataTransfer.files)
      setUploadStatus('idle')
      setUploadMessage('')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files)
      setUploadStatus('idle')
      setUploadMessage('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploadStatus('uploading')
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', selectedFiles[0])

    try {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(percent)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadStatus('success')
          setUploadMessage('Arquivo enviado! Iniciando identificação de trilhas...')
          setSelectedFiles(null)
          if (fileInputRef.current) fileInputRef.current.value = ''
        } else {
          setUploadStatus('error')
          setUploadMessage('Erro ao enviar arquivo. Tente novamente.')
        }
      })

      xhr.addEventListener('error', () => {
        setUploadStatus('error')
        setUploadMessage('Erro de conexão. Verifique sua internet.')
      })

      xhr.open('POST', 'http://localhost:3000/api/upload')
      xhr.send(formData)
    } catch {
      setUploadStatus('error')
      setUploadMessage('Erro inesperado. Tente novamente.')
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
    <>
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Upload de Mídia</h1>
          <p className="text-sm text-slate-500">Envie arquivos de áudio ou vídeo para identificação</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          U
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto bg-slate-50">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CloudUpload className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Envie sua Reportagem</CardTitle>
              <CardDescription className="text-base mt-2">
                Identifique automaticamente as trilhas sonoras em seus conteúdos
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-4">
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-3">
                  <div className={`w-14 h-14 rounded-xl mx-auto flex items-center justify-center transition-all ${
                    isDragging ? 'bg-blue-100 scale-110' : 'bg-slate-100'
                  }`}>
                    <Upload className={`w-7 h-7 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
                  </div>
                  <p className="font-semibold text-lg text-slate-700">Arraste e solte seu arquivo aqui</p>
                  <p className="text-slate-500">
                    ou <span className="text-blue-500 font-medium cursor-pointer hover:underline">clique para selecionar</span>
                  </p>
                  <p className="text-xs text-slate-400 pt-2">
                    MP3, WAV, MP4, MOV, AVI • Máximo 100MB
                  </p>
                </div>
              </div>

              {/* Selected File */}
              {selectedFiles && selectedFiles.length > 0 && uploadStatus !== 'uploading' && (
                <div className="flex items-center gap-4 p-5 rounded-xl bg-slate-50 border">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    {getFileIcon(selectedFiles[0].type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{selectedFiles[0].name}</p>
                    <p className="text-sm text-slate-500">{formatFileSize(selectedFiles[0].size)}</p>
                  </div>
                  <Button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              )}

              {/* Progress */}
              {uploadStatus === 'uploading' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Enviando...</span>
                    <span className="font-medium text-blue-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Success */}
              {uploadStatus === 'success' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertTitle className="text-green-800">Upload concluído!</AlertTitle>
                  <AlertDescription className="text-green-700">{uploadMessage}</AlertDescription>
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
            <Card className="p-5 shadow-md border-0">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                <FileAudio className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Áudio</h3>
              <p className="text-xs text-slate-500 mt-1">MP3, WAV, AAC, OGG, FLAC</p>
            </Card>
            <Card className="p-5 shadow-md border-0">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
                <FileVideo className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-semibold">Vídeo</h3>
              <p className="text-xs text-slate-500 mt-1">MP4, MOV, AVI, WebM, MKV</p>
            </Card>
            <Card className="p-5 shadow-md border-0">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Identificação</h3>
              <p className="text-xs text-slate-500 mt-1">ACRCloud, AcoustID, Audfprint</p>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
