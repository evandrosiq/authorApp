import { useState } from 'react';
import { TableRowAuthor } from "../TableRow/TableRowAuthor";
import { Author, AuthorDataTableProps } from '../../../types/AuthorTypes';





export function AuthorDataTable({ tableData }: AuthorDataTableProps) {
  const [message, setMessage] = useState<string | null>(null);

  function handleSuccess(message: string) {
    setMessage(message);
    console.log("SUCCESS ===> ", message);

  }

  function handleError(message: string) {
    setMessage(message);
    console.log("ERROR ===> ", message);
  }



  return (
    <tbody className='table__data-table'>
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
          <td>Não há dados</td>
        </tr>
      )}
      {/* {message && <tr className="message">{message}</tr>} */}
    </tbody>
  );
}