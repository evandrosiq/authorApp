# ADR-0002 — Substituir ListingService/useTableListing por @tanstack/react-table v9

- **Data:** 2026-08-26
- **Status:** aceita

## Contexto

A SPEC-001 implementou filtro geral, filtro por coluna, ordenação e paginação da
listagem como código próprio: funções puras em `src/services/ListingService.ts`
e um hook (`src/hooks/useTableListing.ts`) que integra esse estado ao
`ApplicationContext` existente. A implementação cobre as 19 RNs da spec com 61
testes, gates verdes, sem dependência externa.

A skill `/avaliacao-de-libs` foi rodada para `@tanstack/react-table` antes desta
decisão (pedido explícito do usuário não dispensa a avaliação). O veredito da
avaliação foi **não trocar**: a responsabilidade já está coberta e testada: a
lib é headless (não resolve renderização/HTML/`aria-sort`, que continuariam
escritos à mão), então a troca não reduz o código de integração, apenas troca
um módulo próprio pequeno e comprovado por uma API externa, sem ganho de
capacidade dentro do escopo atual da SPEC-001 (que exclui explicitamente
multi-sort, seleção em lote e virtualização — os casos em que uma lib de tabela
headless se paga). Compatibilidade técnica, licença (MIT) e segurança
passariam sem ressalva, mas isso era irrelevante diante da eliminação nos
critérios de responsabilidade/plataforma.

O usuário viu o veredito e decidiu seguir com a troca mesmo assim, avaliando
que a lib cobre as features atuais e outras que podem ser úteis no futuro
(colunas redimensionáveis/fixas, multi-sort, virtualização) — decisão dele,
registrada aqui para não ser re-questionada a cada sessão.

## Alternativas consideradas

1. **Manter `ListingService.ts` + `useTableListing.ts`** — zero dependência
   nova, já testado (61 testes/19 RNs), mas sem crescimento embutido para
   necessidades futuras (multi-sort, redimensionar coluna, virtualização)
   além do que a spec atual cobre.
2. **`react-table` v7 (legado)** — mesmo nome popular, mas sem manutenção
   ativa; pior opção que a v9 atual do TanStack.
3. **`@tanstack/react-table` v8** — pinada por engano na primeira leitura do
   pedido; descartada ao confirmar que está em cauda longa (sem release desde
   abril/2025) — a v9 é a mantida hoje.
4. **`@tanstack/react-table` v9** — escolhida. GA desde 2026-08-04, mantida
   ativamente, MIT, zero vulnerabilidade conhecida, sem I/O de rede próprio
   (roda 100% client-side sobre o array já em memória do `localStorage`).

## Decisão

Adotar `@tanstack/react-table` v9 (`@tanstack/react-table` + a dependência
transitiva `@tanstack/react-store` que a v9 introduz) como motor de
sorting/filtering/pagination da listagem, usado **exclusivamente dentro de**
`src/hooks/useTableListing.ts` via a camada de compatibilidade
`useLegacyTable` (subpath `@tanstack/react-table/legacy` — a API v9 "nativa",
`useTable` + `features` explícitas, é recente demais e mais arriscada de
acertar sem exemplos maduros).

Os componentes de UI (`Header`, `DataTable`, `TableRow`, `ListingFilters`,
`Pagination`, `Footer`) **não conhecem o TanStack**: recebem exatamente as
mesmas props simples que recebiam antes desta migração (`sort`/`onSort`,
`page`/`lastValidPage`/`resultRange`/`onPageChange`, etc.) — ver "Bug
encontrado" abaixo para o motivo desta escolha deliberada. `useTableListing`
é o único lugar que importa `@tanstack/react-table`, chama `useLegacyTable` e
lê qualquer getter derivado da tabela (`getRowModel`, `getFilteredRowModel`,
`getPageCount`); ele traduz o resultado para o mesmo formato de retorno que o
hook já tinha (`items`, `resultRange`, `page`, `sort`, `columnFilters`, etc.),
consumido por `HomePage` exatamente como antes.

O estado controlado da tabela (`sorting: SortingState`, `columnFilters:
ColumnFiltersState`, `globalFilter: string`, `pagination: PaginationState` —
tipos do TanStack) vive no `ApplicationContext` (mesmo mecanismo que já mantém
`tableData` vivo entre navegações — RN-16).

Regras que o TanStack não cobre nativamente continuam como lógica própria:

- **RN-13** (ordenar "Tipo de obra" pelo rótulo exibido, não o valor interno) —
  `sortFn` customizada na definição da coluna (`src/services/ListingColumns.ts`;
  **atenção**: o campo se chama `sortFn` na v9, não `sortingFn` como na v8 —
  muda mesmo dentro do modo `useLegacyTable`, porque `ColumnDef` é
  compartilhado entre as duas APIs).
- **RN-08** (mudar filtro/ordenação reseta a página para 1) — efeito próprio em
  `useTableListing`, observando mudanças em `sorting`/`columnFilters`/
  `globalFilter` (com guarda de primeiro-render para não disparar ao
  remontar `HomePage` e quebrar RN-16).
- **RN-17** (recuar de página quando a atual fica vazia após exclusão) — efeito
  próprio comparando `table.getPageCount()` com a página atual, calculado
  dentro do hook.
- **RN-11** (alternar asc/desc na mesma coluna para sempre) —
  `enableSortingRemoval: false` explícito; o padrão da lib (`true`) permite um
  terceiro clique remover a ordenação, o que a RN não previa.

`engines.node` da v9 exige Node ≥20 — compatível com o Node real do ambiente
(20.18.0), mas o projeto não pina `engines` no `package.json`; isso não muda
com esta decisão, só fica registrado como pré-condição não fiscalizada.

## Bug encontrado: `useLegacyTable` não propaga estado para componentes filhos

Durante a implementação, a primeira versão passava a instância `table`
inteira como prop para os componentes de UI (padrão idiomático do TanStack —
`<Pagination table={table} />` chamando `table.nextPage()`,
`table.getCanNextPage()` etc. dentro do próprio componente). Essa versão tinha
dois bugs reproduzidos com testes mínimos isolados:

1. Passar a referência **estável** de um setter de `useState` diretamente como
   `onSortingChange`/`onColumnFiltersChange`/`onGlobalFilterChange`/
   `onPaginationChange` não propaga a mudança quando a tabela é consumida por
   um componente filho — o clique chama o setter, mas o filho nunca
   re-renderiza com o novo estado. Contornável embrulhando em uma arrow
   function nova a cada render (`onPaginationChange: (updater) =>
   setPagination(updater)`), mas isso sozinho não bastou (item 2).
2. Qualquer leitura de um **getter derivado de atoms** (`getCanNextPage`,
   `getFilteredRowModel().rows.length`, `getPageCount`, etc.) feita **dentro
   de um componente filho** que recebeu `table` via prop quebra a propagação
   por completo, mesmo com o workaround do item 1 aplicado — confirmado
   isolando a chamada em um componente mínimo de uma linha.

Isso não acontece quando as mesmas leituras são feitas no **mesmo componente**
que chamou `useLegacyTable` (ou seja, dentro do próprio `useTableListing`).

**Decisão de contorno:** nenhum componente de UI recebe `table` nem chama
qualquer método dela. Todo getter derivado é lido dentro de
`useTableListing`, que devolve valores já calculados (números, strings,
arrays, callbacks fechados) — a mesma interface que o hook expunha antes da
migração. Isso também simplificou a bateria de testes: `Header`,
`Pagination`, `ListingFilters` voltaram a ser testados com props simples,
sem precisar montar uma instância de tabela real em cada teste unitário.

**Reavaliar quando**: a v9 tiver alguns meses de maturidade (GA foi em
2026-08-04 — poucos dias antes desta decisão) ou ao migrar da camada
`useLegacyTable` (deprecated) para a API nova (`useTable` + `features`
explícitas), o que quer que aconteça primeiro. Vale reproduzir os testes
mínimos acima contra a versão nova antes de voltar a passar `table` para
componentes filhos.

## Dependência descartada: `material-react-table`

Cogitada como alternativa para a camada de UI (renderização pronta em cima do
motor de tabela), mas eliminada na mesma sessão: trava `@tanstack/react-table`
como dependência interna em `8.20.6` (sem nenhuma versão publicada compatível
com a v9 já adotada aqui — instalá-la duplicaria o motor de tabela no bundle,
uma cópia v8 isolada dentro do MRT sem nenhuma sinergia com a v9 usada pelo
projeto), exige Material UI + Emotion como peer dependencies (~30 MB, design
system completo para um app que hoje não usa nenhum framework de UI) e está
sem publicação há ~17-18 meses. Ver avaliação completa na sessão que gerou
este ADR.

## Consequências

- Perde-se um módulo próprio pequeno, puro e 100% testado, em troca de uma
  dependência externa cujo pipeline de publicação (org TanStack) já sofreu um
  comprometimento de supply chain em 2026-05-11 — `@tanstack/table`
  especificamente não foi afetado, mas o precedente existe; versão deve ficar
  pinada exata (sem `^`) e ser revisada a cada bump, não atualizada
  automaticamente.
- A lib traz bugs reais de propagação de estado nesta versão recém-lançada
  (ver seção acima) — mitigados isolando toda a interação com `table` dentro
  de `useTableListing`, mas isso é dívida de vigilância: qualquer código
  futuro que volte a passar `table` para um componente de UI reintroduz o
  risco.
- `ListingService.ts`/`ListingColumns.ts` continuam existindo, mas mudaram de
  papel: não são mais "a lógica completa" (reducer, paginação, ordenação
  genérica), só utilitários de normalização de texto (`matchesText`,
  `matchesGeneralFilter`, `typeOfWorkLabel`) e os `filterFn`/`sortFn`
  customizados que o TanStack chama internamente.
- Todas as 19 RNs da SPEC-001 tiveram teste re-portado para a nova
  implementação (mesma cobertura, arquivos diferentes: `ListingColumns.test.ts`
  novo para RN-03/04/05/13; `ListingService.test.ts` reduzido a RN-01/02;
  `Header`/`Pagination`/`useTableListing`/`home.test.tsx` inalterados na
  superfície, já que a interface pública do hook não mudou).
- Ganha-se capacidade de crescimento futura (multi-sort, redimensionar/fixar
  coluna, virtualização) sem nova troca de biblioteca, caso o projeto precise
  disso depois — hoje fora do escopo da SPEC-001.
- `@tanstack/react-store` entra como dependência transitiva nova (exigida pela
  v9); nenhuma outra dependência do projeto conflita com isso.
