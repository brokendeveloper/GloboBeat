"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Music, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push("/upload")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            Globo<span className="text-blue-500">Beat</span>
          </span>
        </Link>
        
        <Link href="/cadastro">
          <Button variant="outline" size="sm">
            Criar conta
          </Button>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-4 text-center pb-2">
              <h1 className="text-3xl font-bold text-slate-900">
                Bem-vindo
              </h1>
              <p className="text-slate-500">
                Entre para identificar trilhas sonoras em seus conteúdos jornalísticos
              </p>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                    <Link 
                      href="/esqueci-senha" 
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-6 pt-2">
              <div className="w-full h-px bg-slate-200" />
              
              <p className="text-center text-sm text-slate-500">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-blue-500 font-semibold hover:underline">
                  Criar conta
                </Link>
              </p>
            </CardFooter>
          </Card>
          
          <p className="text-center text-xs text-slate-400 mt-8">
            Ao entrar, você concorda com nossos{" "}
            <Link href="/termos" className="underline hover:text-slate-600">
              Termos
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="underline hover:text-slate-600">
              Privacidade
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} GloboBeat · <span className="text-blue-500">Porto Digital</span> & Globo
        </p>
      </footer>
    </div>
  )
}
