import { describe, expect, it } from "vitest";
import { compareTypeOfWork, textColumnFilter, typeOfWorkColumnFilter } from "./ListingColumns";

describe("textColumnFilter (RN-03, RN-04)", () => {
  it("RN-03/RN-04: substring normalizado, ignorando caixa e acento", () => {
    expect(textColumnFilter("João Silva", "joao")).toBe(true);
    expect(textColumnFilter("João Silva", "SILVA")).toBe(true);
  });

  it("filtro vazio não exclui nada", () => {
    expect(textColumnFilter("qualquer coisa", "")).toBe(true);
  });

  it("não bate quando o texto não contém o filtro", () => {
    expect(textColumnFilter("João Silva", "maria")).toBe(false);
  });
});

describe("typeOfWorkColumnFilter (RN-05)", () => {
  it("RN-05: seleção exata bate só com o valor idêntico", () => {
    expect(typeOfWorkColumnFilter("fonograma", "fonograma")).toBe(true);
    expect(typeOfWorkColumnFilter("obra", "fonograma")).toBe(false);
  });

  it('RN-05: "Todos" (valor vazio) não filtra por tipo de obra', () => {
    expect(typeOfWorkColumnFilter("obra", "")).toBe(true);
    expect(typeOfWorkColumnFilter("fonograma", "")).toBe(true);
  });
});

describe("compareTypeOfWork (RN-13)", () => {
  it("RN-13: compara pelo rótulo exibido, não pelo valor interno", () => {
    // Ordem alfabética dos rótulos: Fonograma < Obra < Pot-pourri.
    expect(compareTypeOfWork("potpourri", "obra")).toBeGreaterThan(0);
    expect(compareTypeOfWork("fonograma", "obra")).toBeLessThan(0);
    expect(compareTypeOfWork("obra", "obra")).toBe(0);
  });
});
