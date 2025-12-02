"use client"

import Link from "next/link"
import { 
  ArrowLeft,
  Plus,
  Download,
  Filter,
  Music2,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TrilhasPage() {
  const trilhas = [
    {
      nome: "Oceano",
      album: "Oceano",
      banda: "Djavan",
      timeStamp: "00:23 - 1:00",
      politica: "Livre",
      gMusicID: "GMUS001234",
    },
    {
      nome: "Aquarela",
      album: "Toquinho e Vinicius",
      banda: "Toquinho",
      timeStamp: "01:30 - 2:45",
      politica: "Restrita",
      gMusicID: "GMUS005678",
    },
    {
      nome: "Garota de Ipanema",
      album: "The Girl From Ipanema",
      banda: "Tom Jobim",
      timeStamp: "03:00 - 4:15",
      politica: "Não encontrada",
      gMusicID: "GMUS009012",
    },
  ]

  const getPolicyBadge = (policy: string) => {
    if (policy.toLowerCase().includes('livre')) 
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Livre</Badge>
    if (policy.toLowerCase().includes('restrita')) 
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
            <p className="text-sm text-slate-500">{trilhas.length} trilhas encontradas nesta reportagem</p>
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
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-5 border-0 shadow-md">
              <p className="text-3xl font-bold text-green-600">1</p>
              <p className="text-sm text-slate-500 mt-1">Livre para uso</p>
            </Card>
            <Card className="p-5 border-0 shadow-md">
              <p className="text-3xl font-bold text-red-500">1</p>
              <p className="text-sm text-slate-500 mt-1">Uso restrito</p>
            </Card>
            <Card className="p-5 border-0 shadow-md">
              <p className="text-3xl font-bold text-amber-500">1</p>
              <p className="text-sm text-slate-500 mt-1">Não encontrada</p>
            </Card>
          </div>

          {/* Track Cards */}
          <div className="space-y-4">
            {trilhas.map((trilha) => (
              <Card key={trilha.gMusicID} className="shadow-md border-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
                        <Music2 className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{trilha.nome}</h3>
                        <p className="text-slate-500">{trilha.banda} • {trilha.album}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" />
                            {trilha.timeStamp}
                          </span>
                          <span className="font-mono bg-slate-100 px-2 py-1 rounded">{trilha.gMusicID}</span>
                        </div>
                      </div>
                    </div>
                    {getPolicyBadge(trilha.politica)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Help */}
          <Card className="p-5 text-center border-0 bg-blue-50">
            <p className="text-slate-600">
              Adicione trilhas não identificadas ou exporte o relatório para revisão.
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
