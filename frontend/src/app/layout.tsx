import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Provider } from "@/components/ui/provider";
import "./globals.css";
import { Suspense } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { AppFallback } from "@/components/app-fallback";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "GloboBeat",
  description: "Sistema de autenticação GloboBeat",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const suspenseFallback = (
    <Provider>
      <AppFallback />
    </Provider>
  );

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Script
          id="font-awesome"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var head = document.head;
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
                link.crossOrigin = 'anonymous';
                link.referrerPolicy = 'no-referrer';
                head.appendChild(link);
              })();
            `,
          }}
        />
        <Suspense fallback={suspenseFallback}>
          <Provider>
            <ThemeProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </ThemeProvider>
          </Provider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
