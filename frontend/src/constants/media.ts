export interface ReportagemVideo {
  url: string;
  duration: string;
  recordedAt: string;
  location: string;
  description: string;
  thumbnail?: string;
}

const mockVideoPlaylist: ReportagemVideo[] = [
  {
    url: "/mock-videos/152085-802335503_small.mp4",
    duration: "01:04",
    recordedAt: "12/09/2025 • 06:40",
    location: "Estúdio RJ",
    description:
      "Trecho capturado diretamente do switcher editorial da Globo Rio com o áudio original da reportagem.",
  },
  {
    url: "/mock-videos/308073_small.mp4",
    duration: "00:47",
    recordedAt: "09/09/2025 • 18:15",
    location: "Conexão SP",
    description:
      "Recorte utilizado durante a apuração de campo, mantendo o nível de broadcast e metadados de origem.",
  },
  {
    url: "/mock-videos/31569-387675206.mp4",
    duration: "01:28",
    recordedAt: "05/09/2025 • 10:22",
    location: "Estúdio BH",
    description:
      "Sinal em HD ingest do estúdio MG, com registro original de voz e ambientação.",
  },
];

const hashFromKey = (key: string) =>
  key
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getReportagemVideo = (key: string | number) => {
  const sourceIndex =
    hashFromKey(typeof key === "string" ? key : `${key}`) %
    mockVideoPlaylist.length;

  return mockVideoPlaylist[sourceIndex];
};
