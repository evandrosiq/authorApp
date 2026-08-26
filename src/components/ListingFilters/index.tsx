import { ColumnFiltersRowProps, GeneralFilterRowProps } from "../../general";
import { TABLE_COLUMNS_COUNT } from "../Header";
import { TYPE_OF_WORK_OPTIONS } from "../../services/ListingService";

export function GeneralFilterRow({
  generalFilter,
  onGeneralFilterChange,
  onClear,
}: GeneralFilterRowProps) {
  return (
    <tr className="table__row-filter-general" role="row">
      <th className="table__cell-filter-general" role="columnheader" colSpan={TABLE_COLUMNS_COUNT}>
        <label htmlFor="general-filter">Buscar</label>
        <input
          type="text"
          id="general-filter"
          name="generalFilter"
          placeholder="Buscar por autor, tipo ou título"
          value={generalFilter}
          onChange={(event) => onGeneralFilterChange(event.target.value)}
        />
        <button type="button" className="table__filter-clear" onClick={onClear}>
          Limpar filtros
        </button>
      </th>
    </tr>
  );
}

export function ColumnFiltersRow({ columnFilters, onColumnFilterChange }: ColumnFiltersRowProps) {
  return (
    <tr className="table__row-filter-columns" role="row">
      <th className="table__cell-filter" role="columnheader">
        <label htmlFor="author-filter">Autor</label>
        <input
          type="text"
          id="author-filter"
          name="author"
          placeholder="Filtrar por autor"
          value={columnFilters.author}
          onChange={(event) => onColumnFilterChange("author", event.target.value)}
        />
      </th>
      <th className="table__cell-filter" role="columnheader">
        <label htmlFor="type-of-work-filter">Tipo de obra</label>
        <select
          id="type-of-work-filter"
          name="typeOfWork"
          value={columnFilters.typeOfWork}
          onChange={(event) => onColumnFilterChange("typeOfWork", event.target.value)}
        >
          <option value="">Todos</option>
          {TYPE_OF_WORK_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </th>
      <th className="table__cell-filter" role="columnheader">
        <label htmlFor="title-filter">Título</label>
        <input
          type="text"
          id="title-filter"
          name="title"
          placeholder="Filtrar por título"
          value={columnFilters.title}
          onChange={(event) => onColumnFilterChange("title", event.target.value)}
        />
      </th>
      <th className="table__cell-filter" aria-hidden="true" />
    </tr>
  );
}
