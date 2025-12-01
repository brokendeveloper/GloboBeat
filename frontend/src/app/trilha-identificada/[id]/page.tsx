import { TrilhaDetalheClient } from "@/components/trilha-detalhe-client";

export default async function TrilhaIdentificadaDetalhes({
  params,
}: {
  params: { id: string };
}) {
  // TODO: remover atraso quando conectarmos aos dados reais
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return <TrilhaDetalheClient id={params.id} />;
}
