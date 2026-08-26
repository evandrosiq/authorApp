import { describe, expect, it } from "vitest";
import { Author } from "../general";
import {
  ColumnFilters,
  EMPTY_COLUMN_FILTERS,
  INITIAL_LISTING_STATE,
  ListingState,
  clampPage,
  filterItems,
  getResultRange,
  listingReducer,
  matchesGeneralFilter,
  paginate,
  sortItems,
  toggleSort,
  typeOfWorkLabel,
} from "./ListingService";

function makeAuthor(overrides: Partial<Author>): Author {
  return {
    id: "1",
    index: 0,
    title: "Título padrão",
    typeOfWork: "obra",
    author: "Autor padrão",
    lastModify: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const items: Author[] = [
  makeAuthor({ id: "1", index: 0, author: "João Silva", title: "Dom Casmurro", typeOfWork: "obra" }),
  makeAuthor({ id: "2", index: 1, author: "Maria Souza", title: "Trilha Sonora", typeOfWork: "fonograma" }),
  makeAuthor({ id: "3", index: 2, author: "Ana Pereira", title: "Mix de Sucessos", typeOfWork: "potpourri" }),
];

describe("matchesGeneralFilter (RN-01, RN-02)", () => {
  it("RN-01: encontra por substring no autor, ignorando caixa e acento", () => {
    expect(matchesGeneralFilter(items[0], "joao")).toBe(true);
    expect(matchesGeneralFilter(items[0], "JOÃO")).toBe(true);
  });

  it("RN-01: encontra por substring no título", () => {
    expect(matchesGeneralFilter(items[0], "casmurro")).toBe(true);
  });

  it("RN-01: encontra por substring no rótulo exibido do tipo de obra, não no valor interno", () => {
    expect(matchesGeneralFilter(items[2], "pot")).toBe(true);
  });

  it("RN-01: não encontra quando nenhum dos três campos bate", () => {
    expect(matchesGeneralFilter(items[0], "inexistente")).toBe(false);
  });

  it("RN-02: filtro vazio não exclui nada", () => {
    expect(matchesGeneralFilter(items[0], "")).toBe(true);
  });

  it("RN-02: filtro só com espaços não exclui nada", () => {
    expect(matchesGeneralFilter(items[0], "   ")).toBe(true);
  });
});

describe("filterItems — filtro por coluna e combinação AND (RN-03 a RN-06)", () => {
  it("RN-03: filtro de coluna Autor filtra por substring normalizado", () => {
    const filters: ColumnFilters = { ...EMPTY_COLUMN_FILTERS, author: "sil" };
    const result = filterItems(items, "", filters);
    expect(result.map((i) => i.id)).toEqual(["1"]);
  });

  it("RN-04: filtro de coluna Título filtra por substring normalizado", () => {
    const filters: ColumnFilters = { ...EMPTY_COLUMN_FILTERS, title: "trilha" };
    const result = filterItems(items, "", filters);
    expect(result.map((i) => i.id)).toEqual(["2"]);
  });

  it("RN-05: filtro de coluna Tipo de obra é seleção exata", () => {
    const filters: ColumnFilters = { ...EMPTY_COLUMN_FILTERS, typeOfWork: "fonograma" };
    const result = filterItems(items, "", filters);
    expect(result.map((i) => i.id)).toEqual(["2"]);
  });

  it('RN-05: "Todos" (valor vazio) não filtra por tipo de obra', () => {
    const result = filterItems(items, "", EMPTY_COLUMN_FILTERS);
    expect(result).toHaveLength(3);
  });

  it("RN-06: filtro geral e filtro de coluna se combinam com AND", () => {
    const filters: ColumnFilters = { ...EMPTY_COLUMN_FILTERS, typeOfWork: "obra" };
    // "silva" bate no item 1 (autor); typeOfWork=obra também só bate no item 1.
    expect(filterItems(items, "silva", filters).map((i) => i.id)).toEqual(["1"]);
    // "silva" não bate em nenhum item com typeOfWork=fonograma.
    const filtersFonograma: ColumnFilters = { ...EMPTY_COLUMN_FILTERS, typeOfWork: "fonograma" };
    expect(filterItems(items, "silva", filtersFonograma)).toEqual([]);
  });
});

describe("casos-limite do texto filtrado", () => {
  it("trata caracteres especiais de regex como texto literal", () => {
    const withParens = makeAuthor({ id: "4", author: "Autor (edição especial)" });
    expect(matchesGeneralFilter(withParens, "(edição")).toBe(true);
  });

  it("ignora espaços nas pontas do filtro", () => {
    expect(matchesGeneralFilter(items[0], "  joao  ")).toBe(true);
  });
});

describe("typeOfWorkLabel", () => {
  it("traduz o valor interno para o rótulo exibido", () => {
    expect(typeOfWorkLabel("obra")).toBe("Obra");
    expect(typeOfWorkLabel("fonograma")).toBe("Fonograma");
    expect(typeOfWorkLabel("potpourri")).toBe("Pot-pourri");
  });
});

describe("toggleSort (RN-10, RN-11, RN-12)", () => {
  it("RN-10: sem ordenação ativa, ordena ascendente pelo campo clicado", () => {
    expect(toggleSort(null, "author")).toEqual({ field: "author", direction: "asc" });
  });

  it("RN-11: clicar de novo no mesmo campo inverte a direção", () => {
    const first = toggleSort(null, "author");
    const second = toggleSort(first, "author");
    expect(second).toEqual({ field: "author", direction: "desc" });
    const third = toggleSort(second, "author");
    expect(third).toEqual({ field: "author", direction: "asc" });
  });

  it("RN-12: clicar em outro campo troca a ordenação e volta a ascendente", () => {
    const sortedByAuthorDesc = { field: "author" as const, direction: "desc" as const };
    expect(toggleSort(sortedByAuthorDesc, "title")).toEqual({ field: "title", direction: "asc" });
  });
});

describe("sortItems (RN-13)", () => {
  it("RN-13: ordena a coluna Tipo de obra pelo rótulo exibido, não pelo valor interno", () => {
    // Valores internos em ordem alfabética seriam fonograma, obra, potpourri.
    // Rótulos em ordem alfabética são Fonograma, Obra, Pot-pourri — mesma ordem aqui,
    // então usamos um caso onde a ordem dos valores internos discorda dos rótulos.
    const mixed: Author[] = [
      makeAuthor({ id: "a", index: 0, typeOfWork: "potpourri" }), // rótulo "Pot-pourri"
      makeAuthor({ id: "b", index: 1, typeOfWork: "obra" }), // rótulo "Obra"
      makeAuthor({ id: "c", index: 2, typeOfWork: "fonograma" }), // rótulo "Fonograma"
    ];
    const sorted = sortItems(mixed, { field: "typeOfWork", direction: "asc" });
    expect(sorted.map((i) => i.id)).toEqual(["c", "b", "a"]);
  });

  it("mantém a ordem original quando não há ordenação ativa", () => {
    expect(sortItems(items, null)).toEqual(items);
  });

  it("é estável: itens com valor igual mantêm a ordem relativa original", () => {
    const tied: Author[] = [
      makeAuthor({ id: "x", index: 0, author: "Mesmo Nome" }),
      makeAuthor({ id: "y", index: 1, author: "Mesmo Nome" }),
    ];
    const sorted = sortItems(tied, { field: "author", direction: "asc" });
    expect(sorted.map((i) => i.id)).toEqual(["x", "y"]);
  });
});

describe("paginate e getResultRange (RN-07, RN-14)", () => {
  const big: Author[] = Array.from({ length: 25 }, (_, i) =>
    makeAuthor({ id: String(i), index: i, author: `Autor ${i}` }),
  );

  it("RN-07: no máximo 10 itens por página", () => {
    expect(paginate(big, 1)).toHaveLength(10);
    expect(paginate(big, 3)).toHaveLength(5);
  });

  it("RN-14: contador reflete a faixa exibida e o total", () => {
    expect(getResultRange(25, 1)).toEqual({ start: 1, end: 10, total: 25 });
    expect(getResultRange(25, 3)).toEqual({ start: 21, end: 25, total: 25 });
  });

  it("caso-limite: total múltiplo exato de 10 preenche a última página por completo", () => {
    expect(getResultRange(20, 2)).toEqual({ start: 11, end: 20, total: 20 });
  });

  it("caso-limite: nenhum resultado zera a faixa do contador", () => {
    expect(getResultRange(0, 1)).toEqual({ start: 0, end: 0, total: 0 });
  });
});

describe("clampPage (RN-17)", () => {
  it("RN-17: reduz a página quando ela deixou de existir após a lista encolher", () => {
    expect(clampPage(3, 5)).toBe(1); // 5 itens = só 1 página
  });

  it("RN-17: mantém a página quando ela ainda é válida", () => {
    expect(clampPage(2, 15)).toBe(2); // 15 itens = 2 páginas
  });

  it("RN-17: nunca deixa a página abaixo de 1", () => {
    expect(clampPage(1, 0)).toBe(1);
  });
});

describe("listingReducer (RN-08, RN-15, RN-17)", () => {
  const withState = (partial: Partial<ListingState>): ListingState => ({
    ...INITIAL_LISTING_STATE,
    ...partial,
  });

  it("RN-08: alterar o filtro geral volta a página para 1", () => {
    const state = withState({ page: 3 });
    const next = listingReducer(state, { type: "SET_GENERAL_FILTER", value: "silva" });
    expect(next.generalFilter).toBe("silva");
    expect(next.page).toBe(1);
  });

  it("RN-08: alterar um filtro de coluna volta a página para 1", () => {
    const state = withState({ page: 3 });
    const next = listingReducer(state, { type: "SET_COLUMN_FILTER", field: "author", value: "sil" });
    expect(next.columnFilters.author).toBe("sil");
    expect(next.page).toBe(1);
  });

  it("RN-08: alterar a ordenação volta a página para 1", () => {
    const state = withState({ page: 3 });
    const next = listingReducer(state, { type: "TOGGLE_SORT", field: "author" });
    expect(next.sort).toEqual({ field: "author", direction: "asc" });
    expect(next.page).toBe(1);
  });

  it("RN-15: limpar filtros reseta busca geral, filtros de coluna e página, mas preserva a ordenação", () => {
    const state = withState({
      generalFilter: "silva",
      columnFilters: { author: "sil", title: "dom", typeOfWork: "obra" },
      sort: { field: "title", direction: "desc" },
      page: 3,
    });
    const next = listingReducer(state, { type: "CLEAR_FILTERS" });
    expect(next.generalFilter).toBe("");
    expect(next.columnFilters).toEqual(EMPTY_COLUMN_FILTERS);
    expect(next.page).toBe(1);
    expect(next.sort).toEqual({ field: "title", direction: "desc" });
  });

  it("RN-17: CLAMP_PAGE recua a página quando o total encolheu", () => {
    const state = withState({ page: 3 });
    const next = listingReducer(state, { type: "CLAMP_PAGE", totalCount: 5 });
    expect(next.page).toBe(1);
  });
});
