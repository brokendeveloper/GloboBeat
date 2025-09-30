import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

// Configuração base do tema (você pode expandir aqui)
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          500: { value: "#1A365D" },
          600: { value: "#153E75" },
        },
      },
    },
  },
});

// "system" será passado ao ChakraProvider
export const system = createSystem(defaultConfig, config);
