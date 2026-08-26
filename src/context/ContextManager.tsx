import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";
import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ApplicationContextProviderProps,
  ApplicationContextType,
  Author,
} from "../general";
import { getAll } from "../services/AuthorService";
import { PAGE_SIZE } from "../services/ListingService";

export const ApplicationContext = createContext<
  ApplicationContextType | undefined
>(undefined);

export const ApplicationContextProvider = ({
  children,
}: ApplicationContextProviderProps) => {
  const location = useLocation();
  const [tableContext, setTableContext] = useState<Author[] | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    setTableContext(getAll() ?? []);
  }, [location.pathname]);

  return (
    <ApplicationContext.Provider
      value={{
        tableData: tableContext,
        setTableData: setTableContext,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        globalFilter,
        setGlobalFilter,
        pagination,
        setPagination,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
