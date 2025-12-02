import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "GloboBeat | Identificação de Trilhas Sonoras",
  description: "Sistema de identificação automática de trilhas sonoras em conteúdos jornalísticos - Porto Digital & Globo",
  keywords: ["trilhas sonoras", "identificação musical", "direitos autorais", "Globo", "jornalismo"],
  authors: [{ name: "Porto Digital" }],
}

export const viewport = {
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
