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

- **`/revisar-regras SPEC-001` re-auditada pós-migração (2026-08-26):** a
  auditoria original (2026-08-25, 19/19 COBERTA) valia para a implementação
  com reducer próprio; após ADR-0002 trocar o motor, a suíte caiu de 61 para
  48 testes e a re-auditoria achou 4 `PARCIAL` (RN-08, RN-14, RN-15, RN-16) e
  1 `AUSENTE` (RN-19). Todas fechadas com 8 testes novos. **Achado sério**: o
  teste mais rigoroso de RN-16 revelou um bug real — a página não sobrevivia
  à navegação editar→voltar no browser real (só passava em teste porque
  Testing Library não usa `React.StrictMode`). Causa e correção em
  [ADR-0002](adrs/ADR-0002-tanstack-react-table.md) ("reset de página indevido
  sob StrictMode"). Corrigido, confirmado no browser real, protegido por
  teste que roda sob `<StrictMode>` deliberadamente. 55 testes, gates verdes.
  SPEC-001 re-fechada: 19/19 RNs cobertas na implementação atual.
- **`npm audit` zerado (2026-08-26):** [ADR-0003](adrs/ADR-0003-upgrade-vite-vitest.md)
  — `vite` 5.4.21→6.4.3 e `vitest`/`@vitest/coverage-v8` 2.1.9→4.1.11 (pulando a
  v3 inteira), resolvendo as 2 últimas exceções em `audit-allowlist.json`
  (agora vazio). **Achado importante:** `vite@7`/`8` e `@vitejs/plugin-react@5`+
  exigem Node `>=20.19.0`/`22.12.0` — o ambiente tem `20.18.0`, então **vite
  6.4.3 é o teto real**, não a versão mais recente publicada; subir mais exige
  atualizar o Node primeiro. `@vitejs/plugin-react` ficou em `4.7.0` (já
  aceitava vite 6, sem mudança). `jsdom` continua pinado em `^25` (ADR-0001
  atualizado): jsdom 26+ exige Node `>=22.13.0`, mesma limitação. `npm audit`
  agora reporta 0 vulnerabilidades. 48 testes verdes, sem mudança de código —
  só de versão de dependência.
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

- [ADR-0003](adrs/ADR-0003-upgrade-vite-vitest.md) — upgrade de vite (5→6) e
  vitest (2→4) até o teto compatível com o Node do ambiente (2026-08-26); ver
  bloqueio acima.
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
   build, check:patterns, check:audit) estão verdes; `npm audit` zerado.
   `main` local está à frente de `origin` (yarn.lock, react-router-dom,
   SPEC-002, upgrade vite/vitest) — push pendente. Sugestões para a próxima
   sessão:
   - Se o Node do ambiente subir para ≥20.19.0/22.12.0 no futuro, reavaliar o
     teto de vite/vitest/jsdom/@vitejs-plugin-react registrado no ADR-0003.
   - `/code-review` no diff acumulado, se quiser uma revisão de correção/
     simplificação (complementar ao `/revisar-regras`, que olha
     rastreabilidade, não bugs).
