import { z } from "zod";
import {
  trilhaDetalhesMap,
  trilhasIdentificadas,
} from "@/features/trilhas/data";
import {
  type TrilhaDetalhes,
  type TrilhaIdentificadaItem,
  type TrilhaStatus,
} from "@/features/trilhas/types";

const trackSchema = z.object({
  nome: z.string().min(1),
  album: z.string().min(1),
  banda: z.string().min(1),
  timestamp: z.string().min(1),
  politica: z.string().min(1),
  gMusicID: z.string().min(1),
});

const statusSchema = z.union([
  z.literal("Identificada"),
  z.literal("Revisão Necessária"),
]);

const trilhaDetalhesSchema = z.object({
  id: z.string().min(1),
  data: z.string().min(1),
  programa: z.string().min(1),
  editoria: z.string().min(1),
  status: statusSchema,
  tracks: z.array(trackSchema).min(1, "Nenhuma trilha vinculada ao vídeo."),
});

const trilhaIdentificadaSchema = z.array(
  z.object({
    id: z.string(),
    timestamp: z.string(),
    programa: z.string(),
    trilha: z.string(),
    status: statusSchema,
  })
);

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface UploadVideoResponse {
  requestId: string;
  trilhaId: string;
  trilhas: TrilhaIdentificadaItem[];
}

export async function uploadVideo(file: File): Promise<UploadVideoResponse> {
  if (!file || !file.type.startsWith("video/")) {
    throw new Error(
      "Envie um arquivo de vídeo válido (formatos aceitos: MP4, MOV ou MKV)."
    );
  }

  await delay(1300);

  const requestId = `REQ-${Date.now()}`;
  const trilhaId = trilhasIdentificadas[0]?.id ?? "1";

  const parsedList = trilhaIdentificadaSchema.safeParse(trilhasIdentificadas);
  if (!parsedList.success) {
    throw new Error("Resposta inconsistente ao processar as trilhas.");
  }

  return {
    requestId,
    trilhaId,
    trilhas: parsedList.data,
  };
}

export async function fetchTrilhasIdentificadas(): Promise<TrilhaIdentificadaItem[]> {
  await delay(800);
  const parsed = trilhaIdentificadaSchema.safeParse(trilhasIdentificadas);

  if (!parsed.success) {
    throw new Error("Não foi possível carregar as trilhas identificadas.");
  }

  return parsed.data;
}

export async function fetchTrilhaDetalhes(id: string): Promise<TrilhaDetalhes> {
  await delay(900);
  const trilha = trilhaDetalhesMap[id];

  if (!trilha) {
    throw new Error("Trilha não encontrada para a reportagem enviada.");
  }

  const parsed = trilhaDetalhesSchema.safeParse(trilha);
  if (!parsed.success) {
    throw new Error("Os dados recebidos para esta trilha estão incompletos.");
  }

  return parsed.data;
}

export async function updateTrilhaStatus(
  id: string,
  nextStatus: TrilhaStatus
): Promise<TrilhaStatus> {
  await delay(700);
  const trilha = trilhaDetalhesMap[id];

  if (!trilha) {
    throw new Error("Não foi possível localizar a trilha para atualização.");
  }

  trilha.status = nextStatus;
  return nextStatus;
}
