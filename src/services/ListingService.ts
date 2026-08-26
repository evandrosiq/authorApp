import { Author } from "../general";

export const PAGE_SIZE = 10;

export const TYPE_OF_WORK_OPTIONS = [
  { value: "obra", label: "Obra" },
  { value: "fonograma", label: "Fonograma" },
  { value: "potpourri", label: "Pot-pourri" },
] as const;

export function typeOfWorkLabel(value: string): string {
  return TYPE_OF_WORK_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesText(haystack: string, needle: string): boolean {
  const normalizedNeedle = normalize(needle);
  if (normalizedNeedle === "") {
    return true;
  }
  return normalize(haystack).includes(normalizedNeedle);
}

export function matchesGeneralFilter(item: Author, query: string): boolean {
  return (
    matchesText(item.author, query) ||
    matchesText(item.title, query) ||
    matchesText(typeOfWorkLabel(item.typeOfWork), query)
  );
}

export interface ColumnFilters {
  author: string;
  title: string;
  typeOfWork: string;
}

export const EMPTY_COLUMN_FILTERS: ColumnFilters = {
  author: "",
  title: "",
  typeOfWork: "",
};

function matchesColumnFilters(item: Author, filters: ColumnFilters): boolean {
  if (!matchesText(item.author, filters.author)) {
    return false;
  }
  if (!matchesText(item.title, filters.title)) {
    return false;
  }
  if (filters.typeOfWork !== "" && item.typeOfWork !== filters.typeOfWork) {
    return false;
  }
  return true;
}

export function filterItems(items: Author[], generalFilter: string, columnFilters: ColumnFilters): Author[] {
  return items.filter(
    (item) => matchesGeneralFilter(item, generalFilter) && matchesColumnFilters(item, columnFilters),
  );
}

export type SortField = "author" | "typeOfWork" | "title";
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

function sortValue(item: Author, field: SortField): string {
  if (field === "typeOfWork") {
    return typeOfWorkLabel(item.typeOfWork);
  }
  return item[field];
}

export function sortItems(items: Author[], sort: SortState | null): Author[] {
  if (!sort) {
    return items;
  }
  const { field, direction } = sort;
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const compared = sortValue(a.item, field).localeCompare(sortValue(b.item, field), "pt-BR", {
        sensitivity: "base",
      });
      if (compared !== 0) {
        return direction === "asc" ? compared : -compared;
      }
      return a.index - b.index;
    })
    .map((entry) => entry.item);
}

export function toggleSort(current: SortState | null, field: SortField): SortState {
  if (!current || current.field !== field) {
    return { field, direction: "asc" };
  }
  return { field, direction: current.direction === "asc" ? "desc" : "asc" };
}

export function paginate(items: Author[], page: number): Author[] {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

export interface ResultRange {
  start: number;
  end: number;
  total: number;
}

export function getResultRange(totalCount: number, page: number): ResultRange {
  if (totalCount === 0) {
    return { start: 0, end: 0, total: 0 };
  }
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, totalCount);
  return { start, end, total: totalCount };
}

export function getLastValidPage(totalCount: number): number {
  return Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
}

export function clampPage(page: number, totalCount: number): number {
  return Math.min(page, getLastValidPage(totalCount));
}

export interface ListingState {
  generalFilter: string;
  columnFilters: ColumnFilters;
  sort: SortState | null;
  page: number;
}

export const INITIAL_LISTING_STATE: ListingState = {
  generalFilter: "",
  columnFilters: { ...EMPTY_COLUMN_FILTERS },
  sort: null,
  page: 1,
};

export type ListingAction =
  | { type: "SET_GENERAL_FILTER"; value: string }
  | { type: "SET_COLUMN_FILTER"; field: keyof ColumnFilters; value: string }
  | { type: "TOGGLE_SORT"; field: SortField }
  | { type: "SET_PAGE"; page: number }
  | { type: "CLEAR_FILTERS" }
  | { type: "CLAMP_PAGE"; totalCount: number };

export function listingReducer(state: ListingState, action: ListingAction): ListingState {
  switch (action.type) {
    case "SET_GENERAL_FILTER":
      return { ...state, generalFilter: action.value, page: 1 };
    case "SET_COLUMN_FILTER":
      return {
        ...state,
        columnFilters: { ...state.columnFilters, [action.field]: action.value },
        page: 1,
      };
    case "TOGGLE_SORT":
      return { ...state, sort: toggleSort(state.sort, action.field), page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "CLEAR_FILTERS":
      return {
        ...state,
        generalFilter: "",
        columnFilters: { ...EMPTY_COLUMN_FILTERS },
        page: 1,
      };
    case "CLAMP_PAGE":
      return { ...state, page: clampPage(state.page, action.totalCount) };
    default:
      return state;
  }
}

export function getFilteredItems(items: Author[], state: ListingState): Author[] {
  return sortItems(filterItems(items, state.generalFilter, state.columnFilters), state.sort);
}

export function getPageItems(items: Author[], state: ListingState): Author[] {
  return paginate(getFilteredItems(items, state), state.page);
}
