import { DataTable } from "../components/DataTable";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ListingFilters } from "../components/ListingFilters";
import { Pagination } from "../components/Pagination";
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
      <ListingFilters
        generalFilter={generalFilter}
        onGeneralFilterChange={setGeneralFilter}
        columnFilters={columnFilters}
        onColumnFilterChange={setColumnFilter}
        onClear={clearFilters}
      />
      <table className="table">
        <Header sort={sort} onSort={toggleSort} />
        <DataTable items={items} hasAnyItems={hasAnyItems} />
        <Footer />
      </table>
      {resultRange.total > 0 && (
        <Pagination
          page={page}
          lastValidPage={lastValidPage}
          resultRange={resultRange}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
