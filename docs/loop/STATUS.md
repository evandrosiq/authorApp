# STATUS — autor-obra-app

> Painel do Loop de Engenharia. Atualizado ao fim de cada task.
> É o primeiro arquivo lido por /retomar — mantenha-o curto e fiel à realidade.

- **Última atualização:** 2026-08-26
- **Task atual:** nenhuma — SPEC-001 concluída

## Specs

| Spec | Domínio | Nome | Status | Progresso |
|------|---------|------|--------|-----------|
| [SPEC-001](specs/SPEC-001-listagem-filtros-ordenacao-paginacao.md) | — | Filtro, ordenação e paginação da listagem | concluída | 7/7 tasks |

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
- **`TableRow` exibe o valor interno de tipo de obra** (`obra`/`fonograma`/
  `potpourri`), não o rótulo amigável (Obra/Fonograma/Pot-pourri) que o
  `Combobox` do cadastro usa. Pré-existente, descoberto durante a SPEC-001 —
  fora do escopo dela (as RNs da spec tratam apenas de *ordenação* usar o
  rótulo, RN-13, não de como a célula é exibida). Candidato a spec própria se
  o usuário quiser corrigir.
- **`yarn.lock` segue órfão no repositório** e foi visto se regenerando sozinho
  durante a sessão (provável auto-sync do editor, não uma ação desta sessão) —
  o gerenciador oficial é npm (ver CLAUDE.md); considerar removê-lo de vez.

## Decisões recentes

- [ADR-0001](adrs/ADR-0001-vitest-testing-library.md) — Vitest + Testing Library como
  framework de testes (2026-08-25).
- SPEC-001/T3 manteve o estado de filtro/ordenação/página no `ApplicationContext`
  já existente (via `useReducer`), em vez de criar um mecanismo novo — extensão
  direta de um padrão já usado pelo `tableData`, sem ADR próprio.

## Próximos passos

1. Nenhuma task pendente no momento. Todos os gates (testes, lint, tipos,
   build, check:patterns, check:audit) estão verdes. Sugestões para a próxima
   sessão:
   - Commitar o trabalho acumulado (SPEC-001 + infraestrutura do loop + fix
     de audit) — nada disso está commitado ainda.
   - `/especificar` para o bug de exibição do tipo de obra no `TableRow`, se o
     usuário quiser corrigi-lo.
   - Planejar o upgrade major de vite/vitest (ver exceções em
     `audit-allowlist.json`) como task própria, com testes de regressão.
   - `/code-review` no diff acumulado, se quiser uma revisão de correção/
     simplificação antes de commitar (complementar ao `/revisar-regras`, que
     olha rastreabilidade, não bugs).
