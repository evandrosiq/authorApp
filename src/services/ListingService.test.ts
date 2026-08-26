import { describe, expect, it } from "vitest";
import { Author } from "../general";
import { matchesGeneralFilter, typeOfWorkLabel } from "./ListingService";

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
