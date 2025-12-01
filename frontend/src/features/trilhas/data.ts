import { type TrilhaDetalhes, type TrilhaIdentificadaItem } from "./types";

export const trilhasIdentificadas: TrilhaIdentificadaItem[] = [
  {
    id: "1",
    timestamp: "00:23 - 01:00",
    programa: "Manhã Globo",
    trilha: "Oceano - Djavan",
    status: "Identificada",
  },
  {
    id: "2",
    timestamp: "00:45 - 01:15",
    programa: "Radar Cultural",
    trilha: "Primavera - Tim Maia",
    status: "Revisão Necessária",
  },
  {
    id: "3",
    timestamp: "00:10 - 00:37",
    programa: "Noite Beatles",
    trilha: "Something - The Beatles",
    status: "Identificada",
  },
  {
    id: "4",
    timestamp: "01:05 - 01:44",
    programa: "Conexão GloboNews",
    trilha: "Chega de Saudade - João Gilberto",
    status: "Revisão Necessária",
  },
];

export const trilhaDetalhesMap: Record<string, TrilhaDetalhes> = {
  "1": {
    id: "1",
    data: "12/09/2025",
    programa: "Manhã Globo",
    editoria: "Cultura",
    status: "Identificada",
    tracks: [
      {
        nome: "Oceano",
        album: "Oceano",
        banda: "Djavan",
        timestamp: "00:23 - 01:00",
        politica: "Restrita",
        gMusicID: "GMUSIC-001",
      },
    ],
  },
  "2": {
    id: "2",
    data: "10/09/2025",
    programa: "Radar Cultural",
    editoria: "Entretenimento",
    status: "Revisão Necessária",
    tracks: [
      {
        nome: "Primavera",
        album: "Tim Maia",
        banda: "Tim Maia",
        timestamp: "00:45 - 01:10",
        politica: "Livre",
        gMusicID: "GMUSIC-045",
      },
    ],
  },
};
