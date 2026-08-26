import { useEffect, useMemo } from "react";
import {
  ColumnFilters,
  SortField,
  getFilteredItems,
  getLastValidPage,
  getPageItems,
  getResultRange,
} from "../services/ListingService";
import { useApplicationContext } from "./useApplicationContext";

export function useTableListing() {
  const { tableData, listingState, dispatchListing } = useApplicationContext();
  const items = useMemo(() => tableData ?? [], [tableData]);

  const filteredItems = useMemo(() => getFilteredItems(items, listingState), [items, listingState]);
  const pageItems = useMemo(() => getPageItems(items, listingState), [items, listingState]);
  const resultRange = useMemo(
    () => getResultRange(filteredItems.length, listingState.page),
    [filteredItems.length, listingState.page],
  );
  const lastValidPage = useMemo(() => getLastValidPage(filteredItems.length), [filteredItems.length]);

  useEffect(() => {
    dispatchListing({ type: "CLAMP_PAGE", totalCount: filteredItems.length });
  }, [filteredItems.length, dispatchListing]);

  return {
    items: pageItems,
    hasAnyItems: items.length > 0,
    resultRange,
    page: listingState.page,
    lastValidPage,
    generalFilter: listingState.generalFilter,
    columnFilters: listingState.columnFilters,
    sort: listingState.sort,
    setGeneralFilter: (value: string) => dispatchListing({ type: "SET_GENERAL_FILTER", value }),
    setColumnFilter: (field: keyof ColumnFilters, value: string) =>
      dispatchListing({ type: "SET_COLUMN_FILTER", field, value }),
    toggleSort: (field: SortField) => dispatchListing({ type: "TOGGLE_SORT", field }),
    setPage: (page: number) => dispatchListing({ type: "SET_PAGE", page }),
    clearFilters: () => dispatchListing({ type: "CLEAR_FILTERS" }),
  };
}
