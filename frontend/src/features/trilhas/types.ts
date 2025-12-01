export type TrilhaStatus = "Identificada" | "Revisão Necessária";

export interface TrilhaIdentificadaItem {
  id: string;
  timestamp: string;
  programa: string;
  trilha: string;
  status: TrilhaStatus;
}

export interface TrilhaDetalhes {
  id: string;
  data: string;
  programa: string;
  editoria: string;
  status: TrilhaStatus;
  tracks: Array<{
    nome: string;
    album: string;
    banda: string;
    timestamp: string;
    politica: string;
    gMusicID: string;
  }>;
}

import { themeTokens } from "@/constants/theme";

export const statusColor: Record<TrilhaStatus, string> = {
  Identificada: themeTokens.statusSuccess,
  "Revisão Necessária": themeTokens.statusWarning,
};
