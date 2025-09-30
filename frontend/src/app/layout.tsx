import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aula Componentização",
  description: "Exemplo com Chakra UI v3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
