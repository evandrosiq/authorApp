import { Author, AuthorDataTableProps } from "../../src/general";
import { useAuthorActions } from "../../src/hooks/useAuthorActions";
import { TableRowAuthor } from "../components/TableRow/TableRowAuthor";

export function AuthorDataTable({ tableData }: AuthorDataTableProps) {
  const { handleError, handleSuccess } = useAuthorActions();

  return (
    <tbody className="table__data-table">
      {tableData && tableData.length > 0 ? (
        tableData.map((item: Author, index: number) => (
          <TableRowAuthor
            key={item.id}
            id={item.id}
            index={index}
            author={item.author}
            typeOfWork={item.typeOfWork}
            title={item.title}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        ))
      ) : (
        <tr>
          <td>
            <div className="table__img-content">
              <img src="src/assets/no-result-data-not-found-vetor.jpg" alt="Não há dados" />
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
}
