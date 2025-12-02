import type { Metadata } from "next"
import { Outfit, DM_Serif_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Body font - Modern, geometric, distinctive
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

// Display font - Elegant serif for headings
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "GloboBeat | Identificação de Trilhas Sonoras",
  description: "Sistema de identificação automática de trilhas sonoras em conteúdos jornalísticos - Porto Digital & Globo",
  keywords: ["trilhas sonoras", "identificação musical", "direitos autorais", "Globo", "jornalismo"],
  authors: [{ name: "Porto Digital" }],
}

export const viewport = {
  themeColor: "#1a2744",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${outfit.variable} ${dmSerif.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
