import { ListingFiltersProps } from "../../general";
import { TYPE_OF_WORK_OPTIONS } from "../../services/ListingService";
import { InputField } from "../InputField";

export function ListingFilters({
  generalFilter,
  onGeneralFilterChange,
  columnFilters,
  onColumnFilterChange,
  onClear,
}: ListingFiltersProps) {
  return (
    <div className="listing-filters">
      <InputField
        id="general-filter"
        label="Buscar"
        name="generalFilter"
        placeholder="Buscar por autor, tipo ou título"
        value={generalFilter}
        onChange={(event) => onGeneralFilterChange(event.target.value)}
      />
      <InputField
        id="author-filter"
        label="Autor"
        name="author"
        placeholder="Filtrar por autor"
        value={columnFilters.author}
        onChange={(event) => onColumnFilterChange("author", event.target.value)}
      />
      <InputField
        id="title-filter"
        label="Título"
        name="title"
        placeholder="Filtrar por título"
        value={columnFilters.title}
        onChange={(event) => onColumnFilterChange("title", event.target.value)}
      />
      <div className="listing-filters__select">
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
      </div>
      <button type="button" className="listing-filters__clear" onClick={onClear}>
        Limpar filtros
      </button>
    </div>
  );
}
