"use client"

import { useState } from "react";
import { Menu, User, Star } from "lucide-react";
// import { Button } from "@chakra-ui/react";
import Image from "next/image";

export default function PrincipalHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* HEADER */}
      <header className="relative w-full bg-[#055371] h-28 shadow-md text-white">
        <div className="flex items-center justify-between h-full px-6">
          <button
            className="absolute left-8 p-2 rounded hover:bg-[#04415a] transition cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <Menu size={45} />
          </button>

          <User className="absolute right-8" size={42} />
        </div>

        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Image src="/logo.png" alt="Logo" width={119} height={82} style={{ objectFit: "contain" }} />
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`flex justify-center fixed top-0 left-0 h-full w-52 bg-[#055371] text-white transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out p-6 z-50`}
      >
        <nav className="w-full flex flex-col items-center gap-12 mt-12">
          {/* Botão de fechar (ícone) */}
          <button
            className="p-2 rounded hover:bg-[#04415a] transition cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <Menu size={45} />
          </button>

          {/* Links de texto */}
            <div className="!text-2xl !font-bold flex flex-col gap-6">
                <a
                    href="#historico"
                    className=" hover:text-[#04415a] transition"
                    onClick={() => setOpen(false)}
                >
                    Histórico
                </a>
                <a
                    href="#validacao"
                    className=" hover:text-[#04415a] transition"
                    onClick={() => setOpen(false)}
                >
                    Validação
                </a>
            </div>

        </nav>
      </aside>
    </div>
  );
}
