import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./index";

describe("Header — ordenação por coluna (RN-10, RN-11, RN-12)", () => {
  it("RN-10: clicar em um cabeçalho aciona onSort com o campo correspondente", async () => {
    const onSort = vi.fn();
    const user = userEvent.setup();
    render(
      <table>
        <Header sort={null} onSort={onSort} />
      </table>,
    );

    await user.click(screen.getByRole("button", { name: "Autor" }));

    expect(onSort).toHaveBeenCalledWith("author");
  });

  it("RN-11 / RN-12: indica a coluna e a direção ativas via aria-sort", () => {
    render(
      <table>
        <Header sort={{ field: "title", direction: "desc" }} onSort={vi.fn()} />
      </table>,
    );

    expect(screen.getByRole("columnheader", { name: /Obra/ })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
    expect(screen.getByRole("columnheader", { name: /Autor/ })).toHaveAttribute("aria-sort", "none");
  });

  it("não expõe ordenação na coluna Ações", () => {
    render(
      <table>
        <Header sort={null} onSort={vi.fn()} />
      </table>,
    );

    expect(screen.getByRole("columnheader", { name: "Ações" })).toHaveAttribute("aria-sort", "none");
    expect(screen.queryByRole("button", { name: "Ações" })).not.toBeInTheDocument();
  });
});
