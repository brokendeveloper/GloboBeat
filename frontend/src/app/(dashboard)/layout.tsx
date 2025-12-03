"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Music, 
  CloudUpload, 
  Sparkles, 
  History, 
  LogOut 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/upload", label: "Upload", icon: CloudUpload },
  { href: "/trilhas", label: "Trilhas Identificadas", icon: Sparkles },
  { href: "/validacao", label: "Validação", icon: History },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // TODO: Clear auth tokens when auth is implemented
    // localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 flex flex-col animate-slide-in-left">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">
              Globo<span className="text-blue-400">Beat</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? "bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-white/5"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
