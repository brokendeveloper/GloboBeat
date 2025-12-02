"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Music2
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

export default function ValidacaoPage() {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])

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

  const toggleTrackSelection = (id: string) => {
    setSelectedTracks((prev: string[]) => 
      prev.includes(id) ? prev.filter((t: string) => t !== id) : [...prev, id]
    )
  }

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
          <Link href="/trilhas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Validação de Trilhas</h1>
            <p className="text-sm text-slate-500">Confirme ou rejeite as identificações</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-amber-600 border-amber-200 bg-amber-50">
            <Clock className="w-3.5 h-3.5" />
            Pendente
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                Validar {selectedTracks.length > 0 && `(${selectedTracks.length})`}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuItem className="gap-2 text-green-600 cursor-pointer hover:bg-green-50">
                <CheckCircle className="w-4 h-4" />
                Confirmar selecionados
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-red-500 cursor-pointer hover:bg-red-50">
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
          {/* Instructions */}
          <Card className="p-5 border-0 bg-blue-50">
            <p className="text-slate-600">
              <span className="text-blue-600 font-semibold">Dica:</span> Selecione as trilhas clicando sobre elas, depois use o botão "Validar" para confirmar ou rejeitar em lote.
            </p>
          </Card>

          {/* Track Cards */}
          <div className="space-y-4">
            {trilhas.map((trilha) => (
              <Card 
                key={trilha.gMusicID} 
                className={`shadow-md border-0 cursor-pointer transition-all ${
                  selectedTracks.includes(trilha.gMusicID) 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => toggleTrackSelection(trilha.gMusicID)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Checkbox 
                        checked={selectedTracks.includes(trilha.gMusicID)}
                        className="mt-1"
                      />
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
        </div>
      </div>
    </>
  )
}
