import { useState } from 'react';
import { TableRowAuthor } from "../TableRow/TableRowAuthor";
import { Author } from '../../../types/Author';



interface AuthorDataTableProps {
  tableData: Author[] | null;
}

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
    <div>
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
        <div>Não há dados</div>
      )}
      {message && <div className="message">{message}</div>}
    </div>
  );
}