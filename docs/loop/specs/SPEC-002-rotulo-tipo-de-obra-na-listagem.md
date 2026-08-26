# SPEC-002 — Rótulo do tipo de obra na célula da listagem

- **Status:** concluída
- **Criada em:** 2026-08-26
- **Última atualização:** 2026-08-26
- **Anexos:** —

## Objetivo

A célula "Tipo" de cada linha da listagem (`TableRow`) exibe hoje o valor
interno armazenado do tipo de obra (`obra`, `fonograma`, `potpourri`) em vez
do rótulo amigável (Obra, Fonograma, Pot-pourri) que o `Combobox` do cadastro
já usa. Bug pré-existente, descoberto durante a SPEC-001 — a ordenação da
coluna já usa o rótulo (RN-13 da SPEC-001), mas a célula exibida nunca foi
corrigida. Esta spec corrige a exibição.

## Escopo

- Tradução do valor interno do tipo de obra para o rótulo amigável na célula
  "Tipo" da listagem.

### Fora de escopo

- Qualquer mudança em filtro, ordenação ou paginação (já cobertos pela
  SPEC-001) — esta spec toca apenas o que é *exibido* na célula.
- Mudança no valor armazenado no `localStorage` ou no formulário de
  cadastro/edição (que já usa o rótulo amigável via `Combobox`).
- Tradução de outros campos exibidos na listagem (autor, título) — não têm
  esse problema, são exibidos como digitados.

## Regras de negócio

> Cada regra é numerada, testável e sem ambiguidade. Nunca renumere uma RN
> existente; regras novas recebem o próximo número livre.

- **RN-01** — A célula "Tipo" de cada linha da listagem exibe o rótulo
  amigável do tipo de obra — "Obra" para o valor interno `obra`, "Fonograma"
  para `fonograma`, "Pot-pourri" para `potpourri` — nunca o valor interno
  bruto.
- **RN-02** — Se o valor interno do tipo de obra não corresponder a nenhuma
  das três opções conhecidas (dado legado ou corrompido), a célula exibe o
  próprio valor bruto, sem lançar erro nem quebrar a renderização da
  listagem.

## Critérios de aceite

> Formato Dado/Quando/Então. Cada critério referencia as RNs que exercita.

- **CA-01** (RN-01) — Dado um item com `typeOfWork: "fonograma"`, quando a
  listagem é renderizada, então a célula "Tipo" dessa linha exibe
  "Fonograma".
- **CA-02** (RN-01) — Dado itens com os três tipos (`obra`, `fonograma`,
  `potpourri`), quando a listagem é renderizada, então as células "Tipo"
  exibem respectivamente "Obra", "Fonograma" e "Pot-pourri" — nenhum dos
  valores internos brutos aparece na tela.
- **CA-03** (RN-02) — Dado um item com um valor de `typeOfWork` fora das três
  opções conhecidas, quando a listagem é renderizada, então a célula "Tipo"
  exibe o valor bruto e a listagem renderiza normalmente (sem erro).

## Casos-limite e erros

- Dado legado ou corrompido com valor de tipo de obra fora das 3 opções
  fixas (RN-02) — mesmo comportamento de fallback que `typeOfWorkLabel` já
  tem hoje (`src/services/ListingService.ts`), reaproveitado aqui.
- Não afeta o filtro por tipo de obra (RN-05 da SPEC-001), que já compara
  pelo valor interno bruto no `<select>`, nem a ordenação (RN-13 da
  SPEC-001), que já ordena pelo rótulo — esta spec toca só a célula exibida.

## Questões em aberto

- Nenhuma pendente — comportamento direto, sem limites/concorrência/fuso
  horário envolvidos; a função `typeOfWorkLabel` que resolve isso já existe
  e já é usada em `ListingColumns.ts` para a ordenação (RN-13 da SPEC-001).

## Plano

> Preenchido por /planejar. Cada task é pequena, independentemente verificável e
> referencia as RNs que cobre.

| Task | Título | RNs | Status |
|------|--------|-----|--------|
| T1 | Exibir o rótulo amigável na célula "Tipo" | RN-01, RN-02 | concluída |

### T1 — Exibir o rótulo amigável na célula "Tipo"

- **RNs cobertas:** RN-01, RN-02
- **Critério de pronto:** `TableRow` exibe `typeOfWorkLabel(typeOfWork)` em vez
  do valor bruto na célula "Tipo"; teste cobrindo CA-01/CA-02/CA-03. Gates
  verdes.
- **Arquivos prováveis:** `src/components/TableRow/index.tsx` (importar e usar
  `typeOfWorkLabel` de `src/services/ListingService.ts`, já usada por
  `ListingColumns.ts` para a ordenação — RN-13 da SPEC-001), novo
  `src/components/TableRow/index.test.tsx`.
- **Depende de:** —

## Histórico

- 2026-08-26 — spec criada.
- 2026-08-26 — plano gravado (1 task: T1, correção pontual em `TableRow`).
- 2026-08-26 — T1 concluída. `TableRow` passou a exibir
  `typeOfWorkLabel(typeOfWork)` em vez do valor bruto na célula "Tipo" —
  mudança de uma linha, reaproveitando a função já usada por
  `ListingColumns.ts` para a ordenação (RN-13 da SPEC-001). 4 testes novos em
  `src/components/TableRow/index.test.tsx` (3 casos de tradução via
  `it.each` + 1 de fallback para valor desconhecido). Gates verdes, sem
  regressão nos 44 testes preexistentes. **SPEC-002 fechada: 2/2 RNs
  cobertas.**
