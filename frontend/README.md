## GloboBeat Front-end

Interface responsável pelo fluxo de upload das reportagens, exibição das trilhas identificadas e validação final das faixas. Construída com **Next.js 15 (App Router)**, **React 19**, **Chakra UI 3** e tipada com **TypeScript**.

---

### Pré-requisitos

- Node.js >= 18.18
- npm (utilizado nos scripts abaixo)

```bash
cd frontend
npm install
```

### Scripts principais

| Script            | Descrição                                                                 |
| ----------------- | ------------------------------------------------------------------------- |
| `npm run dev`     | Sobe o servidor de desenvolvimento (`localhost:3000`).                    |
| `npm run build`   | Gera o build de produção.                                                 |
| `npm run start`   | Roda o build gerado localmente.                                           |
| `npm run lint`    | Executa o ESLint com as regras do projeto.                                |

---

### Organização das pastas

```
src/
├─ app/                    # Rotas do App Router
│  ├─ page_upload/         # Upload do vídeo e pré-visualização local
│  ├─ trilha-identificada/ # Histórico (lista) e detalhe por id
│  ├─ resultados/, login/… # Demais rotas da prototipagem
├─ components/
│  ├─ trilha-history-list.tsx     # Listagem filtrável das reportagens
│  ├─ trilha-detalhe-client.tsx   # Tela de detalhe com ações de validar
│  ├─ status-message.tsx          # Banner reutilizável para erros/sucesso
│  ├─ layout-wrapper.tsx          # Orquestra Header + Sidebar + Footer
│  └─ …                           # Componentes de UI auxiliares
├─ features/
│  └─ trilhas/
│     ├─ api.ts            # Simulação de API + validação via Zod
│     ├─ hooks.ts          # Hooks (upload e atualização de status)
│     └─ data.ts / types.ts
└─ constants/              # Tokens de tema, mídia mock etc.
```

---

### Fluxo funcional

1. **Upload (`/page_upload`)**
   - O usuário seleciona o vídeo; `useUploadTrilha` valida extensões e controla estados (`idle`, `uploading`, `success`, `error`).
   - O serviço `uploadVideo` (mock) retorna `requestId` + `trilhaId`. Após sucesso, o app redireciona para `/trilha-identificada/[id]?requestId=...`.
   - `StatusMessage` apresenta feedbacks acessíveis durante todo o processo.

2. **Histórico (`/trilha-identificada`)**
   - `fetchTrilhasIdentificadas` busca os envios já processados.
   - `TrilhaHistoryList` oferece filtros por status, busca textual e cards com prévia em vídeo e todas as trilhas detectadas por reportagem.
   - Cada card navega para o detalhe daquela reportagem.

3. **Detalhe (`/trilha-identificada/[id]`)**
   - `fetchTrilhaDetalhes` entrega os metadados completos da reportagem.
   - `useTrilhaStatus` controla as ações de “Confirmar” ou “Negar”, exibindo mensagens de sucesso/erro e atualizando o estado do card.
   - `ReportagemVideoPanel` mostra o vídeo oficial, e `TrackCard` lista todas as faixas encontradas.

---

### Convenções e boas práticas

- **Componentes Client vs Server**: rotas e containers que dependem de hooks (`useState`, `useEffect`) começam com `"use client"`. Server Components fazem apenas `fetch` e passam dados já serializáveis para os clients.
- **Serviços tipados**: `features/trilhas/api.ts` usa **Zod** para validar respostas mockadas e garantir mensagens de erro coerentes com o fluxo real.
- **Hooks reutilizáveis**:
  - `useUploadTrilha` concentra estados e callbacks do upload.
  - `useTrilhaStatus` sincroniza a decisão do usuário com o mock de backend.
- **Feedbacks previsíveis**: `StatusMessage` padroniza mensagens de erro/sucesso em todo o app.
- **Tema**: `ThemeProvider` + `ThemeContext` salvam a preferência em `localStorage`. Componentes que variam por tema (Header/Footer) utilizam `useSyncExternalStore` para evitar problemas de hidratação.

---

### Como evoluir

- Integrar `features/trilhas/api.ts` a uma API real substituindo os mocks sem alterar a interface pública (mantendo os hooks funcionais).
- Adicionar novas páginas seguindo o mesmo padrão: um Server Component responsável por carregar dados e um Client Component cuidando do estado local.
- Expandir `TrilhaHistoryList` com paginação ou filtros adicionais apenas estendendo os arrays de `statusFilters` ou adaptando o hook que busca os dados.

Com isso o front-end permanece previsível, fácil de manter e pronto para receber a API definitiva. Qualquer dúvida adicional está documentada nos arquivos de cada feature através de comentários pontuais.
