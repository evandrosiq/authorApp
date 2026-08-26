import { Dispatch, ReactNode, SetStateAction } from "react";
import { SingleValue } from "react-select";
import {
  ColumnFilters,
  ListingAction,
  ListingState,
  ResultRange,
  SortField,
  SortState,
} from "./services/ListingService";

export interface Author {
  id: string;
  index: number;
  title: string;
  typeOfWork: string;
  author: string;
  lastModify: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface ComboboxProps {
  onChange: (selectedOption: SingleValue<Option> | null) => void;
  defaultValue?: Option;
}

export interface DataTableProps {
  items: Author[];
  hasAnyItems: boolean;
}

export interface HeaderProps {
  sort: SortState | null;
  onSort: (field: SortField) => void;
}

export interface PaginationProps {
  page: number;
  lastValidPage: number;
  resultRange: ResultRange;
  onPageChange: (page: number) => void;
}

export interface ListingFiltersProps {
  generalFilter: string;
  onGeneralFilterChange: (value: string) => void;
  columnFilters: ColumnFilters;
  onColumnFilterChange: (field: keyof ColumnFilters, value: string) => void;
  onClear: () => void;
}

export interface InputProps {
  id: string;
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

export interface TableRowProps {
  id: string;
  index: number;
  author: string;
  typeOfWork: string;
  title: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export interface ApplicationContextType {
  tableData: Author[] | null;
  setTableData: Dispatch<SetStateAction<Author[] | null>>;
  listingState: ListingState;
  dispatchListing: Dispatch<ListingAction>;
}

export interface ApplicationContextProviderProps {
  children: ReactNode;
}
