"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Footer } from "./footer";
import { Flex, Box } from "@chakra-ui/react";
import { themeTokens } from "@/constants/theme";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Routes that should not have Sidebar, Header, and Footer
  const authRoutes = ["/login", "/cadastro", "/"];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <Box position="relative" bg={themeTokens.surfaceBg} minH="100vh">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Flex direction="column" minH="100vh">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        {children}
        <Footer />
      </Flex>
    </Box>
  );
}
