import { legacyCreateColumnHelper } from "@tanstack/react-table/legacy";
import { Author } from "../general";
import { matchesText, typeOfWorkLabel } from "./ListingService";

const columnHelper = legacyCreateColumnHelper<Author>();

/** RN-03/RN-04: substring normalizado (acento/caixa-insensível) sobre o texto da coluna. */
export function textColumnFilter(cellValue: string, filterValue: string): boolean {
  return matchesText(cellValue, filterValue);
}

/** RN-05: seleção exata entre "Todos" (filtro vazio, não filtra) e as opções fixas. */
export function typeOfWorkColumnFilter(cellValue: string, filterValue: string): boolean {
  return filterValue === "" || cellValue === filterValue;
}

/** RN-13: ordena pelo rótulo exibido (Obra/Fonograma/Pot-pourri), não pelo valor interno. */
export function compareTypeOfWork(a: string, b: string): number {
  return typeOfWorkLabel(a).localeCompare(typeOfWorkLabel(b), "pt-BR", { sensitivity: "base" });
}

export const listingColumns = columnHelper.columns([
  columnHelper.accessor("author", {
    id: "author",
    header: "Autor",
    filterFn: (row, columnId, filterValue) =>
      textColumnFilter(String(row.getValue(columnId) ?? ""), String(filterValue ?? "")),
  }),
  columnHelper.accessor("typeOfWork", {
    id: "typeOfWork",
    header: "Tipo",
    sortFn: (rowA, rowB) => compareTypeOfWork(rowA.original.typeOfWork, rowB.original.typeOfWork),
    filterFn: (row, columnId, filterValue) =>
      typeOfWorkColumnFilter(String(row.getValue(columnId) ?? ""), String(filterValue ?? "")),
  }),
  columnHelper.accessor("title", {
    id: "title",
    header: "Obra",
    filterFn: (row, columnId, filterValue) =>
      textColumnFilter(String(row.getValue(columnId) ?? ""), String(filterValue ?? "")),
  }),
  columnHelper.display({
    id: "actions",
    header: "Ações",
    enableSorting: false,
    enableColumnFilter: false,
  }),
]);

export const TABLE_COLUMNS_COUNT = listingColumns.length;
