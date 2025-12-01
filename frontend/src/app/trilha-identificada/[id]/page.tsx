import { TrilhaDetalheClient } from "@/components/trilha-detalhe-client";
import { fetchTrilhaDetalhes } from "@/features/trilhas/api";
import { type TrilhaDetalhes } from "@/features/trilhas/types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ requestId?: string }>;
}

export default async function TrilhaIdentificadaDetalhes({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  let trilha: TrilhaDetalhes | null = null;
  let errorMessage: string | null = null;

  try {
    trilha = await fetchTrilhaDetalhes(id);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro ao buscar os detalhes desta trilha.";
  }

  return (
    <TrilhaDetalheClient
      id={id}
      initialTrilha={trilha}
      requestId={resolvedSearchParams.requestId}
      errorMessage={errorMessage}
    />
  );
}
