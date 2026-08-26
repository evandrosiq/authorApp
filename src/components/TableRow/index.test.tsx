import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ApplicationContextProvider } from "../../context/ContextManager";
import { TableRow } from "./index";

function renderTableRow(typeOfWork: string) {
  return render(
    <MemoryRouter>
      <ApplicationContextProvider>
        <table>
          <tbody>
            <TableRow
              id="1"
              index={0}
              author="Autor Teste"
              typeOfWork={typeOfWork}
              title="Título Teste"
              onSuccess={vi.fn()}
              onError={vi.fn()}
            />
          </tbody>
        </table>
      </ApplicationContextProvider>
    </MemoryRouter>,
  );
}

describe("TableRow — rótulo do tipo de obra (RN-01, RN-02)", () => {
  it.each([
    ["obra", "Obra"],
    ["fonograma", "Fonograma"],
    ["potpourri", "Pot-pourri"],
  ])("CA-01/CA-02 (RN-01): exibe o rótulo amigável para o valor interno %s", (value, label) => {
    renderTableRow(value);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.queryByText(value)).not.toBeInTheDocument();
  });

  it("CA-03 (RN-02): exibe o valor bruto quando o tipo de obra é desconhecido", () => {
    renderTableRow("valor-desconhecido");

    expect(screen.getByText("valor-desconhecido")).toBeInTheDocument();
  });
});
