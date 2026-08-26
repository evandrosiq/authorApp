# STATUS — autor-obra-app

> Painel do Loop de Engenharia. Atualizado ao fim de cada task.
> É o primeiro arquivo lido por /retomar — mantenha-o curto e fiel à realidade.

- **Última atualização:** 2026-08-26
- **Task atual:** nenhuma — SPEC-002 concluída.

## Specs

| Spec | Domínio | Nome | Status | Progresso |
|------|---------|------|--------|-----------|
| [SPEC-001](specs/SPEC-001-listagem-filtros-ordenacao-paginacao.md) | — | Filtro, ordenação e paginação da listagem | concluída | 7/7 tasks |
| [SPEC-002](specs/SPEC-002-rotulo-tipo-de-obra-na-listagem.md) | — | Rótulo do tipo de obra na célula da listagem | concluída | 1/1 task |

> Coluna "Domínio" só é preenchida se o projeto agrupar specs por domínio
> (`docs/loop/specs/<domínio>/`); caso contrário, deixe "—".
> Este projeto usa specs flat (um domínio só: autores/obras).

## Bloqueios e questões em aberto

- **`/revisar-regras SPEC-001` (2026-08-25):** 19/19 RNs cobertas (as 17
  originais + RN-18/RN-19, documentadas depois de uma regra fantasma
  encontrada na auditoria). Nenhuma pendência restante — as 2 lacunas de teste
  encontradas (RN-07 caso-limite de dataset pequeno; RN-09/RN-17 excluir o
  único item restante) já foram fechadas na mesma sessão. 61 testes, gates
  verdes.
- **`npm run check:audit` resolvido (2026-08-26):** `npm audit fix` (sem
  `--force`) eliminou as 3 vulnerabilidades de `brace-expansion` sem breaking
  change. Restaram `vite` (GHSA-fx2h-pf6j-xcff, high) e `vitest`
  (GHSA-5xrq-8626-4rwp, critical) — ambas só têm fix via `--force` com major
  bump (vite 5→6, vitest 2→4), risco de quebrar config/plugins/coverage.
  Registradas como exceção justificada em `audit-allowlist.json` (risco restrito
  ao dev server/test runner local, não compõe o build de produção). Reavaliar
  ao planejar o upgrade major dessas duas. Gate verde agora.
- **`react-router`/`react-router-dom` atualizado 6.30.6 → 7.18.2 (2026-08-26):**
  resolvia 2 vulnerabilidades moderate (open redirect via backslash em
  `<Link>`/`useNavigate`, GHSA-wrjc-x8rr-h8h6; injeção via `deserializeErrors()`,
  GHSA-337j-9hxr-rhxg) — nenhuma correção existe em nenhuma versão 6.x, só a
  partir de 7.18.0. Avaliação rodada (upgrade major, engines/peerDeps
  conferidos: Node ≥20, React ≥18, ambos compatíveis). Uso no código é só API
  clássica (`useNavigate`, `useParams`, `useLocation`, `BrowserRouter`,
  `Routes`, `Route`, sem loaders/data router), risco de breaking change baixo
  e confirmado: 44 testes verdes, gates verdes, navegação testada manualmente
  no browser real (`/` → `/editar/:id` com `useParams` e pré-preenchimento do
  form). Os warnings de "React Router Future Flag" que apareciam nos testes
  desde a v6 sumiram (viraram comportamento padrão da v7).
- **`TableRow` exibe o valor interno de tipo de obra — resolvido (2026-08-26):**
  [SPEC-002](specs/SPEC-002-rotulo-tipo-de-obra-na-listagem.md), 2/2 RNs
  cobertas. `TableRow` agora usa `typeOfWorkLabel(typeOfWork)`, mudança de uma
  linha, 4 testes novos. Gates verdes, sem regressão.
- **`yarn.lock` resolvido (2026-08-26):** removido do rastreamento do git
  (`git rm --cached`) e adicionado ao `.gitignore`. Não foi possível
  identificar no repositório o que regenera o arquivo fisicamente (nenhum
  script, hook ou config do projeto referencia `yarn install`/`yarn` —
  provável processo do editor, fora do controle deste repo); o arquivo pode
  continuar aparecendo no disco, mas nunca mais deve aparecer como pendência
  no `git status` nem ser commitado por engano. Gerenciador oficial continua
  npm (`package-lock.json`).

## Decisões recentes

- [ADR-0002](adrs/ADR-0002-tanstack-react-table.md) — substitui a lógica interna
  de `ListingService.ts`/`useTableListing.ts` (paginação/ordenação genérica,
  reducer) pelo motor `@tanstack/react-table` v9, via `useLegacyTable`
  (2026-08-26). A avaliação de libs recomendou **não** trocar; usuário decidiu
  seguir mesmo assim, visando capacidade de crescimento futura. Uma segunda lib
  cogitada depois (`material-react-table`) foi descartada na mesma sessão: trava
  em `@tanstack/react-table@8.20.6` interno (incompatível com a v9 já adotada) e
  traria MUI/Emotion como peer dependencies. **Achado importante:** `useLegacyTable`
  nesta versão (v9.1.2, GA há poucos dias) tem bugs reais de propagação de
  estado quando a instância `table` é passada para um componente filho — ver
  seção "Bug encontrado" no ADR. Contorno aplicado: nenhum componente de UI
  recebe `table`; toda leitura de getters derivados acontece dentro de
  `useTableListing`, que devolve valores já calculados — os componentes
  (`Header`, `Pagination`, `ListingFilters`, `DataTable`, `Footer`) têm
  exatamente a mesma interface de props que tinham antes da migração. Nenhuma
  RN da SPEC-001 muda — só a implementação por trás. Confirmado com os 44
  testes verdes e verificação manual no browser real (filtro + ordenação +
  paginação combinados).
- [ADR-0001](adrs/ADR-0001-vitest-testing-library.md) — Vitest + Testing Library como
  framework de testes (2026-08-25).
- SPEC-001/T3 manteve o estado de filtro/ordenação/página no `ApplicationContext`
  já existente (via `useReducer`), em vez de criar um mecanismo novo — extensão
  direta de um padrão já usado pelo `tableData`, sem ADR próprio.

## Próximos passos

1. Nenhuma task pendente no momento. Todos os gates (testes, lint, tipos,
   build, check:patterns, check:audit) estão verdes. `main` local está à
   frente de `origin` (remoção do `yarn.lock`, upgrade do `react-router-dom`,
   SPEC-002) — push pendente. Sugestões para a próxima sessão:
   - Planejar o upgrade major de vite/vitest (ver exceções em
     `audit-allowlist.json`) como task própria, com testes de regressão.
   - `/code-review` no diff acumulado, se quiser uma revisão de correção/
     simplificação (complementar ao `/revisar-regras`, que olha
     rastreabilidade, não bugs).
