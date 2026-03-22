"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Music2, 
  Clock, 
  Disc3, 
  User, 
  CheckCircle, 
  XCircle,
  Loader2,
  Calendar,
  BarChart3,
  FileAudio
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Detection {
  id: number
  job_id: string
  upload_id: number | null
  recognized: boolean
  confidence: string
  title: string | null
  artist: string | null
  album: string | null
  fonte: string | null
  score: number
  timestamp_start: string | null
  timestamp_end: string | null
  policy: string | null
  gmusic_id: string | null
  validated: boolean | null
  validated_at: string | null
  created_at: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

export default function DetectionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [detection, setDetection] = useState<Detection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetection = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/detections/${params.id}`)
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.error || 'Falha ao carregar detecção')
        }
        
        setDetection(data.detection)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar detecção')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDetection()
    }
  }, [params.id])

  const handleValidate = async (validated: boolean) => {
    if (!detection) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/detections/${detection.id}/validate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validated })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDetection(prev => prev ? { ...prev, validated, validated_at: new Date().toISOString() } : null)
      }
    } catch (err) {
      console.error('Erro ao validar:', err)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSourceBadge = (fonte: string | null) => {
    const colors: Record<string, string> = {
      'ACRCloud': 'bg-blue-100 text-blue-700 border-blue-200',
      'AcoustID': 'bg-purple-100 text-purple-700 border-purple-200',
      'Banco Local (Audfprint)': 'bg-green-100 text-green-700 border-green-200',
      'Audfprint': 'bg-green-100 text-green-700 border-green-200',
    }
    return colors[fonte || ''] || 'bg-slate-100 text-slate-700 border-slate-200'
  }

  const getPolicyBadge = (policy: string | null) => {
    if (!policy) return { class: 'bg-slate-100 text-slate-700', label: 'Não definida' }
    switch (policy.toLowerCase()) {
      case 'livre':
        return { class: 'bg-green-100 text-green-700', label: '✓ Livre para uso' }
      case 'restrita':
        return { class: 'bg-red-100 text-red-700', label: '✗ Uso restrito' }
      default:
        return { class: 'bg-amber-100 text-amber-700', label: '? Desconhecida' }
    }
  }

  const formatTimestamp = (start: string | null, end: string | null) => {
    if (!start && !end) return 'Não disponível'
    if (start && end) return `${start} → ${end}`
    return start || end || 'N/A'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !detection) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <XCircle className="w-4 h-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error || 'Detecção não encontrada'}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={() => router.back()} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Detalhes da Trilha</h1>
          <p className="text-slate-500 text-sm">ID: {detection.id}</p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-lg border-0 mb-6">
        <CardHeader className="border-b bg-slate-50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white ${
                detection.recognized 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-br from-slate-400 to-slate-500'
              }`}>
                <Music2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">
                    {detection.title || 'Título desconhecido'}
                  </CardTitle>
                  {!detection.recognized && (
                    <Badge variant="secondary" className="bg-slate-200 text-slate-600">
                      Não reconhecida
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 flex items-center gap-2 mt-1">
                  <User className="w-4 h-4" />
                  {detection.artist || 'Artista desconhecido'}
                </p>
                {detection.album && (
                  <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                    <Disc3 className="w-3 h-3" />
                    {detection.album}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getSourceBadge(detection.fonte)}>
                {detection.fonte || 'Fonte desconhecida'}
              </Badge>
              <Badge className={getPolicyBadge(detection.policy).class}>
                {getPolicyBadge(detection.policy).label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-slate-50 text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-2 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Score de Confiança</p>
              <p className={`text-2xl font-bold px-2 py-1 rounded-lg inline-block ${getScoreColor(detection.score)}`}>
                {detection.score}%
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-slate-50 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Trecho no Arquivo</p>
              <p className="text-sm font-semibold">
                {formatTimestamp(detection.timestamp_start, detection.timestamp_end)}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-slate-50 text-center">
              <FileAudio className="w-5 h-5 mx-auto mb-2 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Upload ID</p>
              <p className="text-lg font-semibold">
                #{detection.upload_id || 'N/A'}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-slate-50 text-center">
              <Calendar className="w-5 h-5 mx-auto mb-2 text-slate-400" />
              <p className="text-xs text-slate-500 mb-1">Detectado em</p>
              <p className="text-sm font-semibold">
                {new Date(detection.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Recognition Status Banner */}
          {!detection.recognized && (
            <div className="mb-6 p-4 rounded-lg bg-slate-100 border border-slate-200">
              <p className="text-slate-600 text-sm">
                <strong>Atenção:</strong> Esta trilha não foi reconhecida automaticamente. 
                Os dados exibidos podem estar incompletos.
              </p>
            </div>
          )}

          {/* Validation Status */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Status de Validação</h3>
            
            {detection.validated === null ? (
              <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div>
                  <p className="font-medium text-yellow-800">Aguardando validação</p>
                  <p className="text-sm text-yellow-600">Esta detecção ainda não foi validada.</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleValidate(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar
                  </Button>
                  <Button 
                    onClick={() => handleValidate(false)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeitar
                  </Button>
                </div>
              </div>
            ) : detection.validated ? (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Validado</p>
                  <p className="text-sm text-green-600">
                    Confirmado em {detection.validated_at ? new Date(detection.validated_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Rejeitado</p>
                  <p className="text-sm text-red-600">
                    Rejeitado em {detection.validated_at ? new Date(detection.validated_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold mb-4">Informações Técnicas</h3>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg">
                <dt className="text-slate-500 text-xs uppercase tracking-wide">Status de Reconhecimento</dt>
                <dd className="font-medium mt-1">
                  {detection.recognized ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Reconhecida
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Não reconhecida
                    </span>
                  )}
                </dd>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg">
                <dt className="text-slate-500 text-xs uppercase tracking-wide">Política de Uso</dt>
                <dd className="font-medium mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${getPolicyBadge(detection.policy).class}`}>
                    {detection.policy || 'Não definida'}
                  </span>
                </dd>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg">
                <dt className="text-slate-500 text-xs uppercase tracking-wide">Confiança</dt>
                <dd className="font-medium mt-1">{detection.confidence || 'N/A'}</dd>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <dt className="text-slate-500 text-xs uppercase tracking-wide">Timestamp Início</dt>
                <dd className="font-mono text-sm mt-1">{detection.timestamp_start || 'N/A'}</dd>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg">
                <dt className="text-slate-500 text-xs uppercase tracking-wide">Timestamp Fim</dt>
                <dd className="font-mono text-sm mt-1">{detection.timestamp_end || 'N/A'}</dd>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <dt className="text-slate-500 text-xs uppercase tracking-wide">Fonte</dt>
                <dd className="font-medium mt-1">{detection.fonte || 'Desconhecida'}</dd>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg col-span-2 md:col-span-3">
                <dt className="text-slate-500 text-xs uppercase tracking-wide">Job ID</dt>
                <dd className="font-mono text-xs bg-slate-100 p-2 rounded mt-1 break-all">
                  {detection.job_id}
                </dd>
              </div>
              
              {detection.gmusic_id && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <dt className="text-slate-500 text-xs uppercase tracking-wide">GMusic ID</dt>
                  <dd className="font-mono text-sm mt-1">{detection.gmusic_id}</dd>
                </div>
              )}
            </dl>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button 
          onClick={() => router.push(`/trilhas?uploadId=${detection.upload_id}`)}
          variant="outline"
        >
          Ver todas trilhas deste upload
        </Button>
        <Button 
          onClick={() => router.push('/validacao')}
          variant="outline"
        >
          Ir para Validação
        </Button>
      </div>
    </div>
  )
}
