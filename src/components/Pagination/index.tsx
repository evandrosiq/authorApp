import { PaginationProps } from "../../general";

export function Pagination({ page, lastValidPage, resultRange, onPageChange }: PaginationProps) {
  return (
    <div className="pagination">
      <span className="pagination__counter">
        Mostrando {resultRange.start}–{resultRange.end} de {resultRange.total}
      </span>
      <div className="pagination__controls">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Anterior
        </button>
        <span className="pagination__page">
          Página {page} de {lastValidPage}
        </span>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= lastValidPage}>
          Próxima
        </button>
      </div>
    </div>
  );
}
