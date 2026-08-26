# SPEC-001 — Filtro, ordenação e paginação da listagem

- **Status:** concluída
- **Criada em:** 2026-08-25
- **Última atualização:** 2026-08-25
- **Anexos:** —

## Objetivo

Hoje a listagem de autores/obras (`DataTable`) renderiza todos os itens do
localStorage de uma vez, sem busca, sem ordenação e sem paginação. Conforme o
cadastro cresce, encontrar um item específico exige rolar a tabela inteira. Esta
spec adiciona busca geral, filtro por coluna, ordenação por coluna e paginação à
listagem existente, para quem cadastra e consulta autores/obras.

## Escopo

- Filtro geral (busca livre) sobre autor, tipo de obra e título.
- Filtro por coluna: autor (texto), título (texto), tipo de obra (seleção entre as
  3 opções fixas já usadas no cadastro).
- Ordenação por coluna (autor, tipo de obra, título), clicando no cabeçalho.
- Paginação fixa de 10 itens por página.
- Contador de resultados ("Mostrando X–Y de Z").
- Botão para limpar todos os filtros de uma vez.
- Comportamento da paginação/filtro ao editar ou excluir um item.

### Fora de escopo

- Itens por página configurável pelo usuário (fica fixo em 10 nesta spec).
- Persistir filtro/ordenação/página entre recarregamentos de página (F5) ou entre
  sessões — só sobrevive à navegação interna (ex.: ir editar e voltar).
- Sincronizar o estado do filtro com a URL (query params).
- Exportação dos dados filtrados (CSV, PDF, etc.).
- Seleção múltipla de linhas e ações em lote.
- Busca/paginação no servidor — o dataset inteiro já está em memória
  (localStorage), então filtro/ordenação/paginação são só client-side.

## Regras de negócio

> Cada regra é numerada, testável e sem ambiguidade. Nunca renumere uma RN
> existente; regras novas recebem o próximo número livre.

- **RN-01** — O filtro geral compara o texto digitado, normalizado (minúsculas e
  sem acentos), contra autor, título e o rótulo exibido do tipo de obra (Obra /
  Fonograma / Pot-pourri) de cada item, usando correspondência por substring. Um
  item aparece se o texto normalizado bater em pelo menos um desses três campos.
- **RN-02** — Quando o filtro geral está vazio ou contém só espaços, nenhum item é
  excluído por causa dele (equivale a filtro geral inativo).
- **RN-03** — O filtro de coluna "Autor" compara o texto digitado, normalizado,
  contra o campo autor por substring; funciona de forma independente do filtro
  geral e dos demais filtros de coluna.
- **RN-04** — O filtro de coluna "Título" funciona como a RN-03, mas sobre o campo
  título.
- **RN-05** — O filtro de coluna "Tipo de obra" é uma seleção exata entre "Todos"
  (padrão, não filtra nada) e as três opções fixas (Obra, Fonograma, Pot-pourri);
  não aceita texto livre.
- **RN-06** — O filtro geral e todos os filtros de coluna ativos se combinam com E
  (AND): um item só aparece na listagem se satisfizer o filtro geral (RN-01/RN-02)
  E cada filtro de coluna ativo (RN-03/RN-04/RN-05) simultaneamente.
- **RN-07** — A listagem exibe no máximo 10 itens por página.
- **RN-08** — Alterar o filtro geral, qualquer filtro de coluna, ou a ordenação
  ativa faz a página atual voltar para a página 1.
- **RN-09** — Se existem itens cadastrados mas nenhum satisfaz os filtros ativos, a
  listagem exibe a mensagem "Nenhum resultado encontrado para os filtros
  aplicados" — distinta da imagem/mensagem já existente para "nenhum item
  cadastrado" (base vazia).
- **RN-10** — Clicar no cabeçalho de uma coluna ordenável (Autor, Tipo de obra,
  Título) que não está ordenando a lista passa a ordená-la de forma ascendente por
  aquele campo.
- **RN-11** — Clicar no cabeçalho da coluna que já está ordenando a lista inverte a
  direção da ordenação (ascendente ↔ descendente) sobre o mesmo campo.
- **RN-12** — Clicar no cabeçalho de uma coluna diferente da que está ordenando
  substitui a ordenação ativa pela nova coluna, começando em ordem ascendente.
- **RN-13** — A ordenação da coluna "Tipo de obra" compara o rótulo exibido (Obra /
  Fonograma / Pot-pourri), não o valor interno armazenado (`obra` / `fonograma` /
  `potpourri`) — os dois têm ordens alfabéticas diferentes.
- **RN-14** — O contador de resultados exibe "Mostrando {início}–{fim} de {total}",
  onde {total} é a contagem de itens após aplicar os filtros ativos, e
  {início}/{fim} são os índices (1-based) do primeiro e último item exibidos na
  página atual.
- **RN-15** — O botão "Limpar filtros" reseta o filtro geral e todos os filtros de
  coluna para seu estado padrão (vazio / "Todos") e volta a página atual para 1; a
  ordenação ativa não é alterada por essa ação.
- **RN-16** — O estado de filtro geral, filtros de coluna, ordenação e página atual
  é preservado quando o usuário navega da listagem para editar um item e volta
  para a listagem (não precisa sobreviver a recarregamento da página).
- **RN-17** — Se, após excluir um item, a página atual não existir mais (ficou sem
  nenhum item e não é a página 1), a listagem recua automaticamente para a última
  página que ainda tem itens.
- **RN-18** — O cabeçalho da coluna que está ordenando a listagem exibe um
  indicador visual da direção ativa (▲ ascendente, ▼ descendente), e expõe essa
  informação via `aria-sort` para tecnologia assistiva; colunas não ordenadas
  têm `aria-sort="none"`.
- **RN-19** — Os controles de paginação (contador e Anterior/Próxima) só são
  exibidos quando há pelo menos um resultado após os filtros; em qualquer dos
  dois estados vazios (base vazia ou nenhum resultado do filtro) eles não
  aparecem.

## Critérios de aceite

> Formato Dado/Quando/Então. Cada critério referencia as RNs que exercita.

- **CA-01** (RN-01, RN-02) — Dado itens com autores "João Silva" e "Maria Souza",
  quando o usuário digita "joao" no filtro geral, então só a linha de "João Silva"
  é exibida.
- **CA-02** (RN-02) — Dado o filtro geral vazio, quando a listagem é renderizada,
  então todos os itens (sujeitos aos demais filtros ativos) aparecem.
- **CA-03** (RN-03) — Dado o filtro de coluna "Autor" preenchido com "sil", quando
  aplicado, então só aparecem itens cujo autor contém "sil" (normalizado),
  independente de outros filtros.
- **CA-04** (RN-05) — Dado o filtro de coluna "Tipo de obra" com "Fonograma"
  selecionado, quando aplicado, então só aparecem itens com tipo de obra
  fonograma.
- **CA-05** (RN-06) — Dado filtro geral "silva" e filtro de coluna "Tipo de obra" =
  "Obra" ativos ao mesmo tempo, quando a listagem é renderizada, então só aparecem
  itens que satisfazem os dois filtros simultaneamente.
- **CA-06** (RN-07, RN-14) — Dado 25 itens cadastrados sem nenhum filtro ativo,
  quando a página 1 é exibida, então são mostradas 10 linhas e o contador exibe
  "Mostrando 1–10 de 25".
- **CA-07** (RN-08) — Dado a página atual = 3, quando o usuário altera o filtro
  geral, então a página volta para 1.
- **CA-08** (RN-09) — Dado itens cadastrados mas nenhum batendo com o filtro atual,
  quando a listagem é renderizada, então aparece "Nenhum resultado encontrado para
  os filtros aplicados" (não a imagem de base vazia).
- **CA-09** (RN-10, RN-11, RN-12) — Dado a listagem sem ordenação ativa, quando o
  usuário clica no cabeçalho "Autor", então a lista ordena ascendente por autor;
  um segundo clique no mesmo cabeçalho inverte para descendente; um clique
  seguinte no cabeçalho "Título" ordena ascendente por título.
- **CA-10** (RN-13) — Dado itens com tipo de obra "potpourri" e "obra", quando
  ordenado pela coluna "Tipo de obra" ascendente, então a ordem exibida é
  Fonograma, Obra, Pot-pourri (ordem alfabética dos rótulos).
- **CA-11** (RN-15) — Dado filtro geral, filtros de coluna e página 3 ativos,
  quando o usuário clica em "Limpar filtros", então todos os filtros voltam ao
  padrão, a página volta para 1, e a ordenação ativa permanece a mesma.
- **CA-12** (RN-16) — Dado filtro geral "silva", ordenação por título descendente e
  página 2 ativos, quando o usuário navega para editar um item e volta, então
  filtro, ordenação e página 2 continuam aplicados.
- **CA-13** (RN-17) — Dado a página 2 com exatamente 1 item, quando esse item é
  excluído, então a listagem recua para a página 1 automaticamente.
- **CA-14** (RN-09, RN-17) — Dado um único item cadastrado, quando ele é
  excluído, então a listagem volta ao estado de base vazia (imagem/mensagem
  original), não à mensagem de "nenhum resultado do filtro".
- **CA-15** (RN-07) — Dado um dataset com menos de 10 itens (só a página 1
  existe), quando a listagem é exibida, então os botões Anterior e Próxima
  aparecem ambos desabilitados.
- **CA-16** (RN-18) — Dado o cabeçalho "Autor" ordenando ascendente, quando a
  listagem é renderizada, então o cabeçalho mostra "▲" e `aria-sort="ascending"`;
  os demais cabeçalhos ordenáveis mostram `aria-sort="none"`.
- **CA-17** (RN-19) — Dado zero resultados (base vazia ou filtro sem match),
  quando a listagem é renderizada, então os controles de paginação não aparecem.

## Casos-limite e erros

- Caracteres especiais de regex digitados no filtro (ex.: `(`, `*`, `.`) são
  tratados como texto literal, nunca como expressão regular.
- Espaços nas pontas do texto digitado em qualquer filtro são ignorados (trim)
  antes de comparar.
- Ordenação é estável: itens com valor igual no campo ordenado mantêm a ordem
  relativa que tinham antes de ordenar.
- Dataset com menos de 10 itens: só existe a página 1; não há controles de
  próxima/anterior página ativos.
- Total de itens múltiplo exato de 10 (ex.: 20): a última página vem cheia (itens
  11–20) e o contador reflete isso corretamente.
- Excluir o único item restante do cadastro: a listagem volta ao estado de "base
  vazia" (mensagem/imagem já existente), não ao de "nenhum resultado do filtro"
  (RN-09 não se aplica quando não há nenhum item cadastrado).
- Excluir um item que está fora da página atual (não deveria ser possível pela UI,
  mas por garantia): não deve afetar a página exibida além do recálculo natural do
  total de páginas.

## Questões em aberto

- Nenhuma pendente — decisões (10 itens/página fixo, dropdown para tipo de obra,
  os três extras incluídos, estado preservado ao voltar da edição) confirmadas
  pelo usuário na criação desta spec.

## Plano

> Preenchido por /planejar. Cada task é pequena, independentemente verificável e
> referencia as RNs que cobre.

| Task | Título | RNs | Status |
|------|--------|-----|--------|
| T1 | Saneamento do lint pré-existente | infra | concluída |
| T2 | Lógica pura de filtro, ordenação e paginação | RN-01, RN-02, RN-03, RN-04, RN-05, RN-06, RN-07, RN-08, RN-10, RN-11, RN-12, RN-13, RN-14, RN-15, RN-17 | concluída |
| T3 | Hook de estado da listagem com persistência entre navegações | RN-16 | concluída |
| T4 | Busca geral e filtros por coluna na interface | RN-01, RN-02, RN-03, RN-04, RN-05, RN-06, RN-09 | concluída |
| T5 | Ordenação por coluna na interface | RN-10, RN-11, RN-12, RN-13, RN-18 | concluída |
| T6 | Paginação e contador de resultados na interface | RN-07, RN-08, RN-14, RN-17, RN-19 | concluída |
| T7 | Botão "Limpar filtros" | RN-15 | concluída |

### T1 — Saneamento do lint pré-existente

- **RNs cobertas:** infra — sem RN própria; abre caminho para T2–T7 fecharem com
  gates verdes. O gate de lint (`npm run lint`) é do projeto inteiro, não só dos
  arquivos tocados por uma task; com 12 erros pré-existentes hoje (a maioria em
  `DataTable`/`TableRow`, que esta spec vai reescrever), nenhuma task fecha "pronta"
  sem isso resolvido primeiro.
- **Critério de pronto:** `npm run lint` sem erros nem warnings. Nenhuma regra
  desativada, nenhum `// eslint-disable`, nenhum cast para calar o TypeScript —
  tipos reais no lugar de `any`, variável não utilizada removida ou usada de fato,
  `let` → `const` onde aplicável, dependência de hook corrigida ou justificada.
  `npm test`, `npm run typecheck` e `npm run build` continuam verdes.
- **Arquivos prováveis:** `src/components/DataTable/index.tsx` (8× `no-explicit-any`),
  `src/components/TableRow/index.tsx` (`no-unused-vars`),
  `src/validation/ValidateInputs.ts` (`prefer-const`),
  `src/context/ContextManager.tsx` (warning de dependência do `useMemo`),
  `src/pages/index.tsx` (warnings de `export *`) — lista completa em `npm run lint`.
- **Depende de:** —

### T2 — Lógica pura de filtro, ordenação e paginação

- **RNs cobertas:** RN-01, RN-02, RN-03, RN-04, RN-05, RN-06, RN-07, RN-08, RN-10,
  RN-11, RN-12, RN-13, RN-14, RN-15, RN-17
- **Critério de pronto:** módulo de funções puras (sem React/DOM) com teste próprio
  cobrindo cada RN listada: normalização de acento/caixa, filtro geral e por
  coluna, combinação AND, alternância de ordenação (ascendente/descendente/troca
  de coluna) com comparação estável usando o rótulo exibido de tipo de obra
  (RN-13), paginação, faixa do contador e cálculo da última página válida quando a
  lista encolhe (RN-17), e a transição de "limpar filtros" (reseta filtros e
  página, preserva ordenação). Gates verdes.
- **Arquivos prováveis:** novo `src/services/ListingService.ts`, novo
  `src/services/ListingService.test.ts`.
- **Depende de:** T1.

### T3 — Hook de estado da listagem com persistência entre navegações

- **RNs cobertas:** RN-16
- **Critério de pronto:** novo hook compõe as funções de T2 com estado que
  sobrevive à desmontagem/remontagem de `HomePage` — vive no `ApplicationContext`
  existente (mesmo mecanismo que já mantém `tableData` vivo entre navegações), não
  em `useState` local, que seria perdido ao navegar para `/editar/:id` e voltar.
  Teste cobre que filtro geral, filtros de coluna, ordenação e página não resetam
  entre duas montagens sob o mesmo provider. Gates verdes.
- **Arquivos prováveis:** `src/general.d.ts` (novos campos em
  `ApplicationContextType`), `src/context/ContextManager.tsx`, novo
  `src/hooks/useTableListing.ts`, novo `src/hooks/useTableListing.test.ts`.
- **Depende de:** T2.

### T4 — Busca geral e filtros por coluna na interface

- **RNs cobertas:** RN-01, RN-02, RN-03, RN-04, RN-05, RN-06, RN-09
- **Critério de pronto:** usuário digita na busca geral e nos filtros de coluna
  (Autor, Título texto; Tipo de obra dropdown com "Todos" + as 3 opções fixas) e a
  tabela reflete o resultado combinado (CA-01 a CA-05); mensagem "Nenhum resultado
  encontrado para os filtros aplicados" aparece só quando há itens cadastrados mas
  nenhum bate com o filtro (CA-08), distinta da imagem de base vazia. Testes de
  integração (Testing Library) cobrem os CAs. Gates verdes.
- **Arquivos prováveis:** novo `src/components/ListingFilters/index.tsx`,
  `src/pages/home.tsx`, `src/components/DataTable/index.tsx`, `src/scss/_dataTable.scss`.
- **Depende de:** T3.

### T5 — Ordenação por coluna na interface

- **RNs cobertas:** RN-10, RN-11, RN-12, RN-13, RN-18
- **Critério de pronto:** clicar num cabeçalho ordenável ordena a lista e mostra
  indicador de direção; clicar de novo no mesmo cabeçalho inverte; clicar em outro
  cabeçalho troca de coluna e volta a ascendente (CA-09); ordenar por "Tipo de
  obra" usa o rótulo exibido, não o valor interno (CA-10). Teste de integração.
  Gates verdes.
- **Arquivos prováveis:** `src/components/Header/index.tsx` (hoje estático, sem
  props — passa a receber ordenação atual e callback de clique), `src/pages/home.tsx`,
  `src/scss/_header.scss`.
- **Depende de:** T3.

### T6 — Paginação e contador de resultados na interface

- **RNs cobertas:** RN-07, RN-08, RN-14, RN-17, RN-19
- **Critério de pronto:** navegação entre páginas funciona (máx. 10 itens/página);
  contador mostra "Mostrando X–Y de Z" correto (CA-06); alterar filtro ou
  ordenação volta para a página 1 (CA-07); excluir o único item de uma página
  recua automaticamente para a página anterior (CA-13). Teste de integração. Gates
  verdes.
- **Arquivos prováveis:** novo `src/components/Pagination/index.tsx`,
  `src/pages/home.tsx`, `src/components/Footer/index.tsx` (avaliar se o contador
  entra aqui ou ao lado), `src/scss/`.
- **Depende de:** T3.

### T7 — Botão "Limpar filtros"

- **RNs cobertas:** RN-15
- **Critério de pronto:** botão reseta busca geral e todos os filtros de coluna
  para o padrão (vazio / "Todos") e volta à página 1, sem alterar a ordenação
  ativa (CA-11). Teste de integração. Gates verdes.
- **Arquivos prováveis:** `src/components/ListingFilters/index.tsx`, `src/pages/home.tsx`.
- **Depende de:** T4.

## Histórico

- 2026-08-25 — spec criada.
- 2026-08-25 — plano gravado (7 tasks: T1 saneamento do lint pré-existente como
  infra bloqueante, T2 lógica pura, T3 persistência via Context, T4–T7 UI).
- 2026-08-25 — T1 concluída. Os 12 erros/4 warnings reais estavam em
  `Combobox/CustomStyles.ts` (10× `any`, tipados com `StylesConfig` do
  `react-select`), `TableRow/index.tsx` (binding de catch não usada),
  `ValidateInputs.ts` (`let`→`const`), `ContextManager.tsx` (`useMemo` +
  `useEffect` redundantes, consolidados em um `useEffect`) e `pages/index.tsx`
  (`export *` trocado por reexport nomeado). Nenhuma regra desativada. `npm run
  lint` limpo (0 problemas); demais gates (testes, tipos, build, padrões
  proibidos) verdes.
- 2026-08-25 — T2 concluída. `src/services/ListingService.ts`: funções puras de
  normalização (acento/caixa), filtro geral e por coluna com combinação AND,
  `toggleSort`/`sortItems` (comparação por rótulo exibido no tipo de obra,
  ordenação estável via `localeCompare` pt-BR), paginação, `getResultRange`,
  `clampPage`, e um reducer `listingReducer` cobrindo as transições de estado
  (reset de página, limpar filtros). 32 testes novos, todos citando a RN
  correspondente. Gates verdes.
- 2026-08-25 — T3 concluída. Estado de listagem movido para `useReducer` dentro
  de `ApplicationContextProvider` (mesmo Provider que já mantinha `tableData`
  vivo entre navegações) em vez de `useState` local em `HomePage` — decisão
  registrada no critério de pronto da task, sem ADR separado por ser extensão
  direta de um padrão já existente no projeto, não uma dependência ou módulo
  novo. Novo hook `useTableListing` compõe as funções de T2. Teste dedicado
  simula navegar para `/editar/:id` e voltar, confirmando que o filtro geral
  não reseta; outro teste confirma o recuo automático de página (RN-17) reagindo
  a uma mudança real em `tableData`. Gates verdes.
- 2026-08-25 — T4 concluída. Novo `src/components/ListingFilters` (busca geral +
  filtros de Autor/Título via `InputField` reaproveitado, Tipo de obra via
  `<select>` nativo com "Todos" + as 3 opções fixas — não reaproveitou o
  `Combobox` existente porque ele não suporta uma opção vazia/"Todos" e é usado
  no formulário de cadastro com semântica diferente). `DataTable` passou a
  receber os itens já filtrados/paginados e um `hasAnyItems` para distinguir a
  mensagem de "nenhum resultado do filtro" (RN-09) do estado de base vazia
  pré-existente. 8 testes de integração renderizando `HomePage` real. Gates
  verdes.
- 2026-08-25 — T5 concluída. `Header` deixou de ser estático: cabeçalhos
  Autor/Tipo/Obra viraram botões que disparam `toggleSort`, com `aria-sort` e
  indicador visual (▲/▼) da coluna/direção ativas. Teste unitário do `Header`
  (clique aciona `onSort`, `aria-sort` reflete o estado) + 3 testes de
  integração confirmando a reordenação real das linhas, incluindo RN-13 (tipo
  de obra ordena pelo rótulo, não pelo valor interno). Gates verdes.
- 2026-08-25 — T6 concluída. Novo `src/components/Pagination` (contador
  "Mostrando X–Y de Z" + Anterior/Próxima, desabilitados nos limites),
  renderizado como irmão da `<table>` dentro de `.listing` (não dentro do
  `<tfoot>` existente, para não arriscar o layout do `Footer` atual) e só
  quando há resultado. Teste unitário do componente + testes de integração para
  RN-07/RN-08/RN-14, e um teste que exclui o item real de uma linha na página 2
  para confirmar o recuo automático (RN-17) fim a fim pela UI de verdade — mais
  forte que o teste sintético de T3. Gates verdes.
- 2026-08-25 — T7 concluída. Botão "Limpar filtros" em `ListingFilters`, ligado
  ao `clearFilters` do hook. Teste de integração aplica busca geral, filtro de
  coluna e ordenação, limpa, e confirma que só a ordenação sobrevive. Gates
  verdes. Fim da implementação das 7 tasks: 59 testes novos, todas as 17 RNs
  originais com teste citando o número da regra.
- 2026-08-25 — `/revisar-regras` auditou as 17 RNs: 15 `COBERTA`, 2 `PARCIAL`
  (RN-07 sem teste do caso-limite "dataset < 10 itens, os dois controles de
  paginação desabilitados"; RN-09/RN-17 sem teste de "excluir o único item
  restante volta à base vazia"). Nenhuma `AUSENTE` nem `DIVERGENTE`. Também
  encontrou 2 comportamentos implementados sem RN correspondente (indicador
  visual de ordenação com `aria-sort`; paginação oculta quando não há
  resultado) — decisão do usuário: documentar como RN em vez de remover.
  Ações tomadas: adicionados os 2 testes que faltavam (agora RN-07 e RN-09/
  RN-17 também cobertas sem ressalva) e as **RN-18** e **RN-19** novas,
  cobertas pelos testes que já existiam desde T5/T6. 61 testes no total,
  gates verdes. **SPEC-001 fechada: 19/19 RNs cobertas.**
- 2026-08-26 — [ADR-0002](../adrs/ADR-0002-tanstack-react-table.md): a
  implementação por trás das 19 RNs foi trocada de `ListingService.ts`/
  `useTableListing.ts` próprios para o motor `@tanstack/react-table` v9
  (`useLegacyTable`), por decisão do usuário contra a recomendação da
  avaliação de libs. Nenhuma RN mudou de comportamento — só o motor interno.
  `ListingColumns.ts` (novo) concentra as regras que o TanStack não cobre
  nativamente: `sortFn` customizado para RN-13 (ordenar pelo rótulo, não pelo
  valor interno) e `filterFn` customizado para RN-03/RN-04/RN-05.
  `ListingService.ts` ficou reduzido a utilitários de texto (RN-01/RN-02).
  Durante a implementação foram encontrados dois bugs reais de propagação de
  estado em `useLegacyTable` (v9.1.2, recém-lançada) quando a instância
  `table` é consumida por um componente filho — documentados no ADR. Contorno:
  `useTableListing` isola toda leitura da API do TanStack; os componentes de
  UI (`Header`, `Pagination`, `ListingFilters`, `DataTable`, `Footer`) mantêm
  exatamente a mesma interface de props de antes da migração. Testes
  re-portados (mesma cobertura das 19 RNs, 44 testes — queda de 61 porque a
  paginação/ordenação genérica virou responsabilidade da lib, sem função
  pura própria para testar isoladamente). Gates verdes; confirmado também
  manualmente no browser real.
