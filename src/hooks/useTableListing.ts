import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useLegacyTable,
} from "@tanstack/react-table/legacy";
import { useEffect, useMemo, useRef } from "react";
import { Author } from "../general";
import { listingColumns } from "../services/ListingColumns";
import {
  ColumnFilters,
  matchesGeneralFilter,
  ResultRange,
  SortField,
  SortState,
} from "../services/ListingService";
import { useApplicationContext } from "./useApplicationContext";

// Nota de implementação (ADR-0002): @tanstack/react-table v9.1.2 (via useLegacyTable) tem um bug
// real de propagação de estado quando um componente FILHO lê getters derivados de atoms
// (getCanNextPage, getFilteredRowModel, getRowModel, etc.) recebendo `table` via prop — o clique
// dispara a mudança, mas o filho nunca vê o novo valor. Confirmado com testes mínimos isolados.
// Contorno: toda leitura derivada acontece AQUI, no mesmo componente/escopo que chama
// useLegacyTable — os componentes de UI só recebem valores já calculados (props simples), nunca a
// instância `table`.
export function useTableListing() {
  const {
    tableData,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
  } = useApplicationContext();

  const data = useMemo(() => tableData ?? [], [tableData]);

  const table = useLegacyTable({
    data,
    columns: listingColumns,
    // RN-11: alterna asc/desc na mesma coluna para sempre — nunca remove a ordenação por clique.
    enableSortingRemoval: false,
    state: { sorting, columnFilters, globalFilter, pagination },
    onSortingChange: (updater) => setSorting(updater),
    onColumnFiltersChange: (updater) => setColumnFilters(updater),
    onGlobalFilterChange: (updater) => setGlobalFilter(updater),
    onPaginationChange: (updater) => setPagination(updater),
    globalFilterFn: (row, _columnId, filterValue) =>
      matchesGeneralFilter(row.original, String(filterValue ?? "")),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const items: Author[] = table.getRowModel().rows.map((row) => row.original);
  const filteredCount = table.getFilteredRowModel().rows.length;
  const lastValidPage = Math.max(1, table.getPageCount());
  const page = pagination.pageIndex + 1;
  const resultRange: ResultRange =
    filteredCount === 0
      ? { start: 0, end: 0, total: 0 }
      : {
          start: pagination.pageIndex * pagination.pageSize + 1,
          end: Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredCount),
          total: filteredCount,
        };

  const sort: SortState | null = sorting[0]
    ? { field: sorting[0].id as SortField, direction: sorting[0].desc ? "desc" : "asc" }
    : null;
  const columnFilterValues: ColumnFilters = {
    author: (columnFilters.find((filter) => filter.id === "author")?.value as string) ?? "",
    title: (columnFilters.find((filter) => filter.id === "title")?.value as string) ?? "",
    typeOfWork: (columnFilters.find((filter) => filter.id === "typeOfWork")?.value as string) ?? "",
  };

  // RN-08: mudar filtro geral, filtro de coluna ou ordenação volta para a página 1.
  // O ref evita disparar no mount/remontagem (RN-16 precisa preservar a página ao voltar da edição).
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    table.setPageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, columnFilters, globalFilter]);

  // RN-17: recua para a última página válida quando a exclusão esvazia a página atual.
  const pageCount = table.getPageCount();
  useEffect(() => {
    if (pageCount > 0 && pagination.pageIndex > pageCount - 1) {
      setPagination((prev) => ({ ...prev, pageIndex: pageCount - 1 }));
    }
  }, [pageCount, pagination.pageIndex, setPagination]);

  function toggleSort(field: SortField) {
    setSorting((current) => {
      const existing = current[0];
      if (!existing || existing.id !== field) {
        return [{ id: field, desc: false }];
      }
      return [{ id: field, desc: !existing.desc }];
    });
  }

  function setColumnFilter(field: keyof ColumnFilters, value: string) {
    setColumnFilters((current) => {
      const others = current.filter((filter) => filter.id !== field);
      return value === "" ? others : [...others, { id: field, value }];
    });
  }

  function clearFilters() {
    setColumnFilters([]);
    setGlobalFilter("");
    table.setPageIndex(0);
  }

  return {
    items,
    hasAnyItems: data.length > 0,
    resultRange,
    page,
    lastValidPage,
    setPage: (newPage: number) => table.setPageIndex(newPage - 1),
    generalFilter: globalFilter,
    setGeneralFilter: setGlobalFilter,
    columnFilters: columnFilterValues,
    setColumnFilter,
    sort,
    toggleSort,
    clearFilters,
  };
}
