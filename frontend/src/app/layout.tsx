import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Provider } from "@/components/ui/provider"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "GloboBeat",
  description: "Sistema de autenticação GloboBeat",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Provider>{children}</Provider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
