"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Music2,
  Loader2,
  AlertCircle,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  getPendingValidations, 
  getDetectionsByUpload, 
  batchValidate, 
  type MusicDetection 
} from "@/lib/api"

export default function ValidacaoPage() {
  const searchParams = useSearchParams()
  const uploadId = searchParams.get('uploadId')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detections, setDetections] = useState<MusicDetection[]>([])
  const [selectedTracks, setSelectedTracks] = useState<number[]>([])
  const [validating, setValidating] = useState(false)

  useEffect(() => {
    loadData()
  }, [uploadId])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (uploadId) {
        const result = await getDetectionsByUpload(parseInt(uploadId))
        // Filter to only show unvalidated detections
        setDetections(result.detections.filter(d => d.validated === null))
      } else {
        const result = await getPendingValidations(100, 0)
        setDetections(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const toggleTrackSelection = (id: number) => {
    setSelectedTracks((prev) => 
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const handleBatchValidate = async (validated: boolean) => {
    if (selectedTracks.length === 0) return
    
    setValidating(true)
    try {
      await batchValidate(selectedTracks, validated)
      // Remove validated items from list
      setDetections(prev => prev.filter(d => !selectedTracks.includes(d.id)))
      setSelectedTracks([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar')
    } finally {
      setValidating(false)
    }
  }

  const getPolicyBadge = (policy: string | null) => {
    if (!policy) return <Badge variant="secondary">Desconhecido</Badge>
    if (policy.toLowerCase() === 'livre') 
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Livre</Badge>
    if (policy.toLowerCase() === 'restrita') 
      return <Badge variant="destructive">Restrita</Badge>
    return <Badge variant="secondary">Não encontrada</Badge>
  }

  return (
    <>
      {/* Header */}
      <header className="h-16 border-b bg-white flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Link href="/trilhas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Validação de Trilhas</h1>
            <p className="text-sm text-slate-500">
              {loading ? 'Carregando...' : `${detections.length} trilha(s) pendente(s)`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-amber-600 border-amber-200 bg-amber-50">
            <Clock className="w-3.5 h-3.5" />
            Pendente
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={selectedTracks.length === 0 || validating}
              >
                {validating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                Validar {selectedTracks.length > 0 && `(${selectedTracks.length})`}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuItem 
                className="gap-2 text-green-600 cursor-pointer hover:bg-green-50"
                onClick={() => handleBatchValidate(true)}
              >
                <CheckCircle className="w-4 h-4" />
                Confirmar selecionados
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="gap-2 text-red-500 cursor-pointer hover:bg-red-50"
                onClick={() => handleBatchValidate(false)}
              >
                <XCircle className="w-4 h-4" />
                Rejeitar selecionados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Gerar PDF
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 overflow-auto bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
              <p className="text-slate-500">Carregando trilhas para validação...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="p-6 border-red-200 bg-red-50">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-800">Erro ao carregar</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
              <Button onClick={loadData} variant="outline" size="sm" className="mt-4">
                Tentar novamente
              </Button>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && detections.length === 0 && (
            <Card className="p-8 text-center border-0 shadow-md">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <h3 className="font-semibold text-lg text-slate-700">Tudo validado!</h3>
              <p className="text-slate-500 mt-2">
                Não há trilhas pendentes de validação.
              </p>
              <Link href="/upload">
                <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                  Fazer novo upload
                </Button>
              </Link>
            </Card>
          )}

          {/* Content with data */}
          {!loading && !error && detections.length > 0 && (
            <>
              {/* Instructions */}
              <Card className="p-5 border-0 bg-blue-50">
                <p className="text-slate-600">
                  <span className="text-blue-600 font-semibold">Dica:</span> Selecione as trilhas clicando sobre elas, depois use o botão "Validar" para confirmar ou rejeitar em lote.
                </p>
              </Card>

              {/* Track Cards */}
              <div className="space-y-4">
                {detections.map((detection) => (
                  <Card 
                    key={detection.id} 
                    className={`shadow-md border-0 cursor-pointer transition-all ${
                      selectedTracks.includes(detection.id) 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => toggleTrackSelection(detection.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Checkbox 
                            checked={selectedTracks.includes(detection.id)}
                            className="mt-1"
                          />
                          <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
                            <Music2 className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{detection.title || 'Título desconhecido'}</h3>
                            <p className="text-slate-500">
                              {detection.artist || 'Artista desconhecido'} • {detection.album || 'Álbum desconhecido'}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                              {detection.timestamp_start && (
                                <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                                  <Clock className="w-3 h-3" />
                                  {detection.timestamp_start} - {detection.timestamp_end || '?'}
                                </span>
                              )}
                              {detection.gmusic_id && (
                                <span className="font-mono bg-slate-100 px-2 py-1 rounded">{detection.gmusic_id}</span>
                              )}
                              {detection.fonte && (
                                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">{detection.fonte}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/trilhas/${detection.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-500">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          {getPolicyBadge(detection.policy)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selection Info */}
              {selectedTracks.length > 0 && (
                <Card className="p-5 flex items-center justify-between border-0 bg-blue-50">
                  <p className="text-slate-700">
                    <span className="font-bold text-blue-600">{selectedTracks.length}</span> trilha(s) selecionada(s)
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedTracks([])}
                  >
                    Limpar seleção
                  </Button>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
