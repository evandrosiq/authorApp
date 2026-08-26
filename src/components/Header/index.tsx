import { HeaderProps } from "../../general";
import { SortField } from "../../services/ListingService";

const SORTABLE_COLUMNS: { field: SortField; label: string }[] = [
  { field: "author", label: "Autor" },
  { field: "typeOfWork", label: "Tipo" },
  { field: "title", label: "Obra" },
];

export function Header({ sort, onSort }: HeaderProps) {
  return (
    <thead className="table__content-header" role="rowgroup">
      <tr className="table__row-header" role="row">
        {SORTABLE_COLUMNS.map(({ field, label }) => {
          const isActive = sort?.field === field;
          const ariaSort = !isActive ? "none" : sort.direction === "asc" ? "ascending" : "descending";
          return (
            <th
              key={field}
              className="table__cell-header"
              role="columnheader"
              aria-sort={ariaSort}
            >
              <button type="button" onClick={() => onSort(field)}>
                {label}
                {isActive && (sort.direction === "asc" ? " ▲" : " ▼")}
              </button>
            </th>
          );
        })}
        <th className="table__cell-header" role="columnheader" aria-sort="none">
          Ações
        </th>
      </tr>
    </thead>
  );
}
