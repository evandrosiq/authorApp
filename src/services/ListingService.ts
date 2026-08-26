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

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesText(haystack: string, needle: string): boolean {
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

export type SortField = "author" | "typeOfWork" | "title";
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface ResultRange {
  start: number;
  end: number;
  total: number;
}
