import { Author, DataTableProps } from "../../general";
import { useAuthorActions } from "../../hooks/useAuthorActions";
import { TableRow } from "../TableRow";

export function DataTable({ items, hasAnyItems }: DataTableProps) {
  const { handleError, handleSuccess } = useAuthorActions();

  if (items.length === 0) {
    return (
      <tbody className="table__data-table">
        <tr>
          <td>
            {hasAnyItems ? (
              <div className="table__empty-message">
                Nenhum resultado encontrado para os filtros aplicados.
              </div>
            ) : (
              <div className="table__img-content">
                <img src="src/assets/no-result-data-not-found-vetor.jpg" alt="Não há dados" />
              </div>
            )}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="table__data-table">
      {items.map((item: Author, index: number) => (
        <TableRow
          key={item.id}
          id={item.id}
          index={index}
          author={item.author}
          typeOfWork={item.typeOfWork}
          title={item.title}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      ))}
    </tbody>
  );
}
