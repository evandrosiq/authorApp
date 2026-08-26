import { DataTable } from "../components/DataTable";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ColumnFiltersRow, GeneralFilterRow } from "../components/ListingFilters";
import { useTableListing } from "../hooks/useTableListing";

export function HomePage(): React.ReactElement {
  const {
    items,
    hasAnyItems,
    resultRange,
    page,
    lastValidPage,
    setPage,
    generalFilter,
    setGeneralFilter,
    columnFilters,
    setColumnFilter,
    sort,
    toggleSort,
    clearFilters,
  } = useTableListing();

  return (
    <div className="listing">
      <table className="table">
        <thead className="table__content-header" role="rowgroup">
          <GeneralFilterRow
            generalFilter={generalFilter}
            onGeneralFilterChange={setGeneralFilter}
            onClear={clearFilters}
          />
          <Header sort={sort} onSort={toggleSort} />
          <ColumnFiltersRow columnFilters={columnFilters} onColumnFilterChange={setColumnFilter} />
        </thead>
        <DataTable items={items} hasAnyItems={hasAnyItems} />
        <Footer
          page={page}
          lastValidPage={lastValidPage}
          resultRange={resultRange}
          onPageChange={setPage}
        />
      </table>
    </div>
  );
}
