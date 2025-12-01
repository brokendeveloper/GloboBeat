import { useCallback, useMemo, useState } from "react";
import {
  fetchTrilhaDetalhes,
  uploadVideo,
  updateTrilhaStatus,
  type UploadVideoResponse,
} from "@/features/trilhas/api";
import { type TrilhaDetalhes, type TrilhaStatus } from "@/features/trilhas/types";

type UploadState = {
  status: "idle" | "uploading" | "success" | "error";
  errorMessage: string | null;
  requestId: string | null;
  trilhaId: string | null;
};

interface UseUploadTrilhaOptions {
  onSuccess?: (response: UploadVideoResponse) => void;
}

export function useUploadTrilha(options: UseUploadTrilhaOptions = {}) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    errorMessage: null,
    requestId: null,
    trilhaId: null,
  });

  const resetUploadState = () => {
    setUploadState({
      status: "idle",
      errorMessage: null,
      requestId: null,
      trilhaId: null,
    });
  };

  const setUploadError = (message: string) => {
    setUploadState({
      status: "error",
      errorMessage: message,
      requestId: null,
      trilhaId: null,
    });
  };

  const uploadTrilha = useCallback(
    async (file: File | null) => {
      if (!file) {
        setUploadError("Selecione um arquivo de vídeo para continuar.");
        return;
      }

      setUploadState((prev) => ({
        ...prev,
        status: "uploading",
        errorMessage: null,
      }));

      try {
        const response = await uploadVideo(file);
        setUploadState({
          status: "success",
          errorMessage: null,
          requestId: response.requestId,
          trilhaId: response.trilhaId,
        });

        options.onSuccess?.(response);
      } catch (error) {
        setUploadState({
          status: "error",
          requestId: null,
          trilhaId: null,
          errorMessage:
            error instanceof Error
              ? error.message
              : "Não foi possível processar o upload. Tente novamente.",
        });
      }
    },
    [options]
  );

  return {
    uploadState,
    uploadTrilha,
    resetUploadState,
    setUploadError,
  };
}

type Acao = "" | "confirmar" | "negar";

interface UseTrilhaStatusOptions {
  trilhaId: string;
  initialStatus: TrilhaStatus;
}

export function useTrilhaStatus({ trilhaId, initialStatus }: UseTrilhaStatusOptions) {
  const [status, setStatus] = useState<TrilhaStatus>(initialStatus);
  const [acaoSelecionada, setAcaoSelecionada] = useState<Acao>(() => {
    if (initialStatus === "Identificada") return "confirmar";
    if (initialStatus === "Revisão Necessária") return "negar";
    return "";
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectAcao = (acao: Exclude<Acao, "">) => {
    setAcaoSelecionada(acao);
    setStatus(acao === "confirmar" ? "Identificada" : "Revisão Necessária");
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const persistDecision = async () => {
    if (!acaoSelecionada) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const nextStatus =
        acaoSelecionada === "confirmar" ? "Identificada" : "Revisão Necessária";
      const updatedStatus = await updateTrilhaStatus(trilhaId, nextStatus);
      setStatus(updatedStatus);
      setSuccessMessage(
        updatedStatus === "Identificada"
          ? "A trilha foi confirmada para esta reportagem."
          : "A trilha foi enviada para revisão."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao registrar a decisão. Tente novamente.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    status,
    acaoSelecionada,
    isSaving,
    successMessage,
    errorMessage,
    selectAcao,
    persistDecision,
  };
}

export function useTrilhaDetalhes(id: string) {
  const [data, setData] = useState<TrilhaDetalhes | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetchTrilhaDetalhes(id);
      setData(response);
      setErrorMessage(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao buscar os detalhes desta trilha.";
      setErrorMessage(message);
    }
  }, [id]);

  return {
    data,
    errorMessage,
    fetchData,
  };
}
