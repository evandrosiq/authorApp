import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ApplicationContextProvider } from "../context/ContextManager";
import { Author } from "../general";
import { create } from "../services/AuthorService";
import { HomePage } from "./home";

function makeAuthor(overrides: Partial<Author>): Author {
  return {
    id: "1",
    index: 0,
    title: "Título",
    typeOfWork: "obra",
    author: "Autor",
    lastModify: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <ApplicationContextProvider>
        <HomePage />
      </ApplicationContextProvider>
    </MemoryRouter>,
  );
}

describe("HomePage — filtro geral (RN-01, RN-02)", () => {
  it("RN-01: filtra por substring no autor, ignorando caixa e acento", async () => {
    create(makeAuthor({ id: "1", author: "João Silva", title: "Dom Casmurro" }));
    create(makeAuthor({ id: "2", author: "Maria Souza", title: "Outra Obra" }));
    const user = userEvent.setup();
    renderHomePage();

    expect(await screen.findByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Buscar"), "joao");

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.queryByText("Maria Souza")).not.toBeInTheDocument();
  });

  it("RN-02: filtro geral vazio mostra todos os itens", async () => {
    create(makeAuthor({ id: "1", author: "João Silva" }));
    create(makeAuthor({ id: "2", author: "Maria Souza" }));
    renderHomePage();

    expect(await screen.findByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
  });
});

describe("HomePage — filtro por coluna (RN-03, RN-04, RN-05, RN-06)", () => {
  it("RN-03: filtro de coluna Autor filtra por substring", async () => {
    create(makeAuthor({ id: "1", author: "João Silva" }));
    create(makeAuthor({ id: "2", author: "Maria Souza" }));
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("João Silva");

    await user.type(screen.getByLabelText("Autor"), "sil");

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.queryByText("Maria Souza")).not.toBeInTheDocument();
  });

  it("RN-04: filtro de coluna Título filtra por substring", async () => {
    create(makeAuthor({ id: "1", author: "João Silva", title: "Dom Casmurro" }));
    create(makeAuthor({ id: "2", author: "Maria Souza", title: "Outra Obra" }));
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("Dom Casmurro");

    await user.type(screen.getByLabelText("Título"), "casmurro");

    expect(screen.getByText("Dom Casmurro")).toBeInTheDocument();
    expect(screen.queryByText("Outra Obra")).not.toBeInTheDocument();
  });

  it("RN-05: filtro de coluna Tipo de obra seleciona um valor exato", async () => {
    create(makeAuthor({ id: "1", author: "João Silva", typeOfWork: "obra" }));
    create(makeAuthor({ id: "2", author: "Maria Souza", typeOfWork: "fonograma" }));
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("João Silva");

    await user.selectOptions(screen.getByLabelText("Tipo de obra"), "fonograma");

    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
  });

  it("RN-06: filtro geral e filtro de coluna se combinam com AND", async () => {
    create(makeAuthor({ id: "1", author: "João Silva", typeOfWork: "obra" }));
    create(makeAuthor({ id: "2", author: "João Pereira", typeOfWork: "fonograma" }));
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("João Silva");

    await user.type(screen.getByLabelText("Buscar"), "joao");
    await user.selectOptions(screen.getByLabelText("Tipo de obra"), "obra");

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.queryByText("João Pereira")).not.toBeInTheDocument();
  });
});

describe("HomePage — ordenação por coluna (RN-10, RN-11, RN-12, RN-13)", () => {
  it("RN-10, RN-11: ordena por Autor ascendente e inverte no segundo clique", async () => {
    create(makeAuthor({ id: "1", author: "Bruno" }));
    create(makeAuthor({ id: "2", author: "Ana" }));
    create(makeAuthor({ id: "3", author: "Carla" }));
    const user = userEvent.setup();
    const { container } = renderHomePage();
    await screen.findByText("Bruno");

    const authorCells = () =>
      Array.from(container.querySelectorAll(".table__row .table__cell:first-of-type")).map(
        (el) => el.textContent,
      );

    await user.click(screen.getByRole("button", { name: "Autor" }));
    expect(authorCells()).toEqual(["Ana", "Bruno", "Carla"]);

    await user.click(screen.getByRole("button", { name: /Autor/ }));
    expect(authorCells()).toEqual(["Carla", "Bruno", "Ana"]);
  });

  it("RN-12: clicar em outro cabeçalho troca a ordenação e volta a ascendente", async () => {
    create(makeAuthor({ id: "1", author: "Bruno", title: "Zebra" }));
    create(makeAuthor({ id: "2", author: "Ana", title: "Abelha" }));
    const user = userEvent.setup();
    const { container } = renderHomePage();
    await screen.findByText("Bruno");

    await user.click(screen.getByRole("button", { name: "Autor" }));
    await user.click(screen.getByRole("button", { name: "Obra" }));

    const titleCells = () =>
      Array.from(container.querySelectorAll(".table__row .table__cell:nth-child(3)")).map(
        (el) => el.textContent,
      );
    expect(titleCells()).toEqual(["Abelha", "Zebra"]);
  });

  it("RN-13: ordena Tipo de obra pelo rótulo exibido, não pelo valor interno", async () => {
    create(makeAuthor({ id: "1", author: "AutorPot", typeOfWork: "potpourri" }));
    create(makeAuthor({ id: "2", author: "AutorObra", typeOfWork: "obra" }));
    create(makeAuthor({ id: "3", author: "AutorFono", typeOfWork: "fonograma" }));
    const user = userEvent.setup();
    const { container } = renderHomePage();
    await screen.findByText("AutorPot");

    await user.click(screen.getByRole("button", { name: "Tipo" }));

    const authorCells = () =>
      Array.from(container.querySelectorAll(".table__row .table__cell:first-of-type")).map(
        (el) => el.textContent,
      );
    // Ordem alfabética dos rótulos: Fonograma, Obra, Pot-pourri.
    expect(authorCells()).toEqual(["AutorFono", "AutorObra", "AutorPot"]);
  });
});

describe("HomePage — paginação e contador (RN-07, RN-08, RN-14)", () => {
  it("RN-07, RN-14: mostra no máximo 10 itens por página e o contador correspondente", async () => {
    for (let i = 0; i < 25; i += 1) {
      create(makeAuthor({ id: String(i), index: i, author: `Autor ${String(i).padStart(2, "0")}` }));
    }
    renderHomePage();

    expect(await screen.findByText("Mostrando 1–10 de 25")).toBeInTheDocument();
    expect(screen.getAllByText(/^Autor \d{2}$/)).toHaveLength(10);
  });

  it("RN-07: navega para a próxima página e para a anterior", async () => {
    for (let i = 0; i < 15; i += 1) {
      create(makeAuthor({ id: String(i), index: i, author: `Autor ${String(i).padStart(2, "0")}` }));
    }
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("Mostrando 1–10 de 15");
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(await screen.findByText("Mostrando 11–15 de 15")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Anterior" }));
    expect(await screen.findByText("Mostrando 1–10 de 15")).toBeInTheDocument();
  });

  it("RN-08: alterar o filtro geral enquanto em outra página volta para a página 1", async () => {
    for (let i = 0; i < 15; i += 1) {
      create(makeAuthor({ id: String(i), index: i, author: `Autor ${String(i).padStart(2, "0")}` }));
    }
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("Mostrando 1–10 de 15");

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(await screen.findByText("Mostrando 11–15 de 15")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Buscar"), "Autor 0");
    expect(await screen.findByText("Página 1 de 1")).toBeInTheDocument();
  });
});

describe("HomePage — recuo automático de página ao excluir (RN-17)", () => {
  it("recua para a página anterior quando a exclusão esvazia a página atual", async () => {
    for (let i = 0; i < 11; i += 1) {
      create(makeAuthor({ id: String(i), index: i, author: `Autor ${String(i).padStart(2, "0")}` }));
    }
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("Mostrando 1–10 de 11");

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(await screen.findByText("Mostrando 11–11 de 11")).toBeInTheDocument();

    await user.click(screen.getByTitle("Excluir"));

    expect(await screen.findByText("Mostrando 1–10 de 10")).toBeInTheDocument();
  });
});

describe("HomePage — limpar filtros (RN-15)", () => {
  it("reseta busca geral e filtros de coluna, volta à página 1, mas preserva a ordenação", async () => {
    for (let i = 0; i < 15; i += 1) {
      create(
        makeAuthor({
          id: String(i),
          index: i,
          author: `Autor ${String(i).padStart(2, "0")}`,
          typeOfWork: i % 2 === 0 ? "obra" : "fonograma",
        }),
      );
    }
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("Mostrando 1–10 de 15");

    await user.click(screen.getByRole("button", { name: "Autor" }));
    await user.type(screen.getByLabelText("Buscar"), "Autor 0");
    await user.type(screen.getByLabelText("Autor"), "0");
    await user.type(screen.getByLabelText("Título"), "Título");
    await user.selectOptions(screen.getByLabelText("Tipo de obra"), "obra");

    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));

    expect(screen.getByLabelText("Buscar")).toHaveValue("");
    expect(screen.getByLabelText("Autor")).toHaveValue("");
    expect(screen.getByLabelText("Título")).toHaveValue("");
    expect(screen.getByLabelText("Tipo de obra")).toHaveValue("");
    expect(await screen.findByText("Mostrando 1–10 de 15")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /Autor/ })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });
});

describe("HomePage — estado vazio do filtro (RN-09)", () => {
  it("RN-09: mostra mensagem de nenhum resultado quando há itens mas o filtro não bate com nenhum", async () => {
    create(makeAuthor({ id: "1", author: "João Silva" }));
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("João Silva");

    await user.type(screen.getByLabelText("Buscar"), "inexistente");

    expect(
      screen.getByText("Nenhum resultado encontrado para os filtros aplicados."),
    ).toBeInTheDocument();
    expect(screen.queryByAltText("Não há dados")).not.toBeInTheDocument();
  });

  it("mostra o estado de base vazia quando não há nenhum item cadastrado", async () => {
    renderHomePage();

    expect(await screen.findByAltText("Não há dados")).toBeInTheDocument();
  });

  it("RN-09/RN-17: excluir o único item cadastrado volta à base vazia, não à mensagem de filtro", async () => {
    create(makeAuthor({ id: "1", author: "Único Autor" }));
    const user = userEvent.setup();
    renderHomePage();
    await screen.findByText("Único Autor");

    await user.click(screen.getByTitle("Excluir"));

    expect(await screen.findByAltText("Não há dados")).toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum resultado encontrado para os filtros aplicados."),
    ).not.toBeInTheDocument();
  });
});
