import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./index";

function renderPagination(props: React.ComponentProps<typeof Pagination>) {
  return render(
    <table>
      <tfoot>
        <Pagination {...props} />
      </tfoot>
    </table>,
  );
}

describe("Pagination", () => {
  it("RN-14: mostra a faixa e o total de resultados", () => {
    renderPagination({
      page: 2,
      lastValidPage: 3,
      resultRange: { start: 11, end: 20, total: 25 },
      onPageChange: vi.fn(),
    });

    expect(screen.getByText("Mostrando 11–20 de 25")).toBeInTheDocument();
    expect(screen.getByText("Página 2 de 3")).toBeInTheDocument();
  });

  it("RN-07: desabilita 'Anterior' na primeira página e 'Próxima' na última", () => {
    const { rerender } = renderPagination({
      page: 1,
      lastValidPage: 3,
      resultRange: { start: 1, end: 10, total: 25 },
      onPageChange: vi.fn(),
    });
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próxima" })).not.toBeDisabled();

    rerender(
      <table>
        <tfoot>
          <Pagination
            page={3}
            lastValidPage={3}
            resultRange={{ start: 21, end: 25, total: 25 }}
            onPageChange={vi.fn()}
          />
        </tfoot>
      </table>,
    );
    expect(screen.getByRole("button", { name: "Anterior" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled();
  });

  it("RN-07: caso-limite — dataset com menos de 10 itens desabilita os dois controles na única página", () => {
    renderPagination({
      page: 1,
      lastValidPage: 1,
      resultRange: { start: 1, end: 5, total: 5 },
      onPageChange: vi.fn(),
    });

    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled();
  });

  it("aciona onPageChange com a página seguinte/anterior ao clicar", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    renderPagination({
      page: 2,
      lastValidPage: 3,
      resultRange: { start: 11, end: 20, total: 25 },
      onPageChange,
    });

    await user.click(screen.getByRole("button", { name: "Próxima" }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole("button", { name: "Anterior" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
