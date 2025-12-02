"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  Plus,
  Download,
  Filter,
  Music2,
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDetectionsByUpload, getUploads, type MusicDetection, type DetectionStats, type Upload } from "@/lib/api"

export default function TrilhasPage() {
  const searchParams = useSearchParams()
  const uploadId = searchParams.get('uploadId')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detections, setDetections] = useState<MusicDetection[]>([])
  const [stats, setStats] = useState<DetectionStats>({ total: 0, livre: 0, restrita: 0, unknown: 0 })
  const [uploads, setUploads] = useState<Upload[]>([])
  const [selectedUploadId, setSelectedUploadId] = useState<number | null>(uploadId ? parseInt(uploadId) : null)

  useEffect(() => {
    loadData()
  }, [selectedUploadId])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // If we have a specific upload, load its detections
      if (selectedUploadId) {
        const result = await getDetectionsByUpload(selectedUploadId)
        setDetections(result.detections)
        setStats(result.stats)
      } else {
        // Load list of uploads to let user pick one
        const uploadsList = await getUploads(20, 0)
        setUploads(uploadsList)
        
        // If there are uploads, auto-select the most recent one
        if (uploadsList.length > 0) {
          const mostRecent = uploadsList[0]
          setSelectedUploadId(mostRecent.id)
          const result = await getDetectionsByUpload(mostRecent.id)
          setDetections(result.detections)
          setStats(result.stats)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
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
          <Link href="/upload">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Trilhas Identificadas</h1>
            <p className="text-sm text-slate-500">
              {loading ? 'Carregando...' : `${detections.length} trilha(s) encontrada(s)`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
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
              <p className="text-slate-500">Carregando trilhas...</p>
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
              <Music2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h3 className="font-semibold text-lg text-slate-700">Nenhuma trilha identificada</h3>
              <p className="text-slate-500 mt-2">
                As trilhas aparecerão aqui quando o processamento for concluído.
              </p>
              <Link href="/upload">
                <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                  Fazer novo upload
                </Button>
              </Link>
            </Card>
          )}

          {/* Stats */}
          {!loading && !error && detections.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-5 border-0 shadow-md">
                  <p className="text-3xl font-bold text-green-600">{stats.livre}</p>
                  <p className="text-sm text-slate-500 mt-1">Livre para uso</p>
                </Card>
                <Card className="p-5 border-0 shadow-md">
                  <p className="text-3xl font-bold text-red-500">{stats.restrita}</p>
                  <p className="text-sm text-slate-500 mt-1">Uso restrito</p>
                </Card>
                <Card className="p-5 border-0 shadow-md">
                  <p className="text-3xl font-bold text-amber-500">{stats.unknown}</p>
                  <p className="text-sm text-slate-500 mt-1">Não encontrada</p>
                </Card>
              </div>

              {/* Track Cards */}
              <div className="space-y-4">
                {detections.map((detection) => (
                  <Card key={detection.id} className="shadow-md border-0 hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
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
                        {getPolicyBadge(detection.policy)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <Card className="p-5 text-center border-0 bg-blue-50">
                <p className="text-slate-600 mb-4">
                  Revise as trilhas identificadas e prossiga para validação.
                </p>
                <Link href={`/validacao${selectedUploadId ? `?uploadId=${selectedUploadId}` : ''}`}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Ir para Validação
                  </Button>
                </Link>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  )
}
