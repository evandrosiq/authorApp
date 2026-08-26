import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ApplicationContextProvider } from "../context/ContextManager";
import { Author } from "../general";
import { create } from "../services/AuthorService";
import { useApplicationContext } from "./useApplicationContext";
import { useTableListing } from "./useTableListing";

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

function ListingConsumer() {
  const { generalFilter, setGeneralFilter } = useTableListing();
  const navigate = useNavigate();
  return (
    <div>
      <span data-testid="general-filter">{generalFilter}</span>
      <input
        aria-label="busca"
        value={generalFilter}
        onChange={(event) => setGeneralFilter(event.target.value)}
      />
      <button onClick={() => navigate("/editar/1")}>editar</button>
    </div>
  );
}

function EditPlaceholder() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/")}>voltar</button>;
}

function renderNavigationScenario() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <ApplicationContextProvider>
        <Routes>
          <Route path="/" element={<ListingConsumer />} />
          <Route path="/editar/:id" element={<EditPlaceholder />} />
        </Routes>
      </ApplicationContextProvider>
    </MemoryRouter>,
  );
}

describe("useTableListing — persistência entre navegações (RN-16)", () => {
  it("mantém o filtro geral ao navegar para editar e voltar para a listagem", async () => {
    const user = userEvent.setup();
    renderNavigationScenario();

    await user.type(screen.getByLabelText("busca"), "silva");
    expect(screen.getByTestId("general-filter")).toHaveTextContent("silva");

    await user.click(screen.getByText("editar"));
    expect(screen.queryByLabelText("busca")).not.toBeInTheDocument();

    await user.click(screen.getByText("voltar"));
    expect(screen.getByTestId("general-filter")).toHaveTextContent("silva");
  });
});

function ListingSummary() {
  const { items, resultRange, page, setPage } = useTableListing();
  return (
    <div>
      <span data-testid="total">{resultRange.total}</span>
      <span data-testid="page">{page}</span>
      <span data-testid="count">{items.length}</span>
      <button onClick={() => setPage(2)}>page2</button>
    </div>
  );
}

function renderSummary() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <ApplicationContextProvider>
        <ListingSummary />
      </ApplicationContextProvider>
    </MemoryRouter>,
  );
}

describe("useTableListing — composição da lógica pura", () => {
  it("reflete os itens de tableData paginados via ListingService", async () => {
    for (let i = 0; i < 12; i += 1) {
      create(makeAuthor({ id: String(i), index: i, author: `Autor ${i}` }));
    }
    const user = userEvent.setup();
    renderSummary();

    expect(await screen.findByTestId("total")).toHaveTextContent("12");
    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByTestId("count")).toHaveTextContent("10");

    await user.click(screen.getByText("page2"));
    expect(screen.getByTestId("page")).toHaveTextContent("2");
    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });
});

function ListingWithDelete() {
  const { page, setPage } = useTableListing();
  const { setTableData } = useApplicationContext();
  return (
    <div>
      <span data-testid="page">{page}</span>
      <button onClick={() => setPage(2)}>page2</button>
      <button onClick={() => setTableData((current) => (current ?? []).slice(0, 10))}>
        excluir-ultimo
      </button>
    </div>
  );
}

function renderWithDelete() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <ApplicationContextProvider>
        <ListingWithDelete />
      </ApplicationContextProvider>
    </MemoryRouter>,
  );
}

describe("useTableListing — recuo automático de página (RN-17)", () => {
  it("recua a página quando a exclusão esvazia a página atual", async () => {
    for (let i = 0; i < 11; i += 1) {
      create(makeAuthor({ id: String(i), index: i, author: `Autor ${i}` }));
    }
    const user = userEvent.setup();
    renderWithDelete();

    await user.click(screen.getByText("page2"));
    expect(await screen.findByTestId("page")).toHaveTextContent("2");

    await user.click(screen.getByText("excluir-ultimo"));
    expect(await screen.findByTestId("page")).toHaveTextContent("1");
  });
});
