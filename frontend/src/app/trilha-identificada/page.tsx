"use client"

import Link from "next/link"
import { 
  Music, 
  CloudUpload, 
  Sparkles, 
  History, 
  Settings, 
  LogOut,
  ArrowLeft,
  Plus,
  Download,
  Filter,
  Music2,
  Clock,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function TrilhasIdentificadas() {
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
      album: "Toquinho e Vinícius",
      banda: "Toquinho",
      timeStamp: "01:15 - 2:30",
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
            className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <CloudUpload className="w-4 h-4" />
            Upload
          </Link>
          <Link 
            href="/trilha-identificada"
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-accent text-accent-foreground font-medium"
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
          <div className="flex items-center gap-4">
            <Link href="/page_upload">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Trilhas Identificadas</h1>
              <p className="text-sm text-muted-foreground">{trilhas.length} trilhas encontradas</p>
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
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-2xl font-bold text-green-600">1</p>
                <p className="text-sm text-muted-foreground">Livre</p>
              </Card>
              <Card className="p-4">
                <p className="text-2xl font-bold text-destructive">1</p>
                <p className="text-sm text-muted-foreground">Restrita</p>
              </Card>
              <Card className="p-4">
                <p className="text-2xl font-bold text-yellow-600">1</p>
                <p className="text-sm text-muted-foreground">Não encontrada</p>
              </Card>
            </div>

            {/* Track Cards */}
            <div className="space-y-3">
              {trilhas.map((trilha) => (
                <Card key={trilha.gMusicID} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Music2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{trilha.nome}</h3>
                          <p className="text-sm text-muted-foreground">{trilha.banda} • {trilha.album}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {trilha.timeStamp}
                            </span>
                            <span className="font-mono">{trilha.gMusicID}</span>
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
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Adicione trilhas não identificadas ou exporte o relatório para revisão.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
