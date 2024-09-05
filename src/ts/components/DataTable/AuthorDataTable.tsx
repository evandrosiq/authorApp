import { useState } from 'react';
import { TableRowAuthor } from "../TableRow/TableRowAuthor";

export function AuthorDataTable() {
  const [message, setMessage] = useState<string | null>(null);

  interface Author {
    id: string
    index: number;
    title: string;
    typeOfWork: string;
    author: string;
  }
  function handleSuccess(message: string) {
    setMessage(message);
    console.log("SUCCESS ===> ", message);

  }

  function handleError(message: string) {
    setMessage(message);
    console.log("ERROR ===> ", message);
  }

  const items = [
    { id: '123', author: 'Caetano Veloso', typeOfWork: 'pot-pourri', title: 'Sozinho, Queixa e Sonhos', index: 0 },
    { id: '124', author: 'Caetano Veloso', typeOfWork: 'pot-pourri', title: 'Sozinho, Queixa e Sonhos', index: 1 },
  ];

  return (
    <div>
      {items.map((item: Author) => (
        <TableRowAuthor
          key={item.id}
          id={item.id}
          index={item.index}
          author={item.author}
          typeOfWork={item.typeOfWork}
          title={item.title}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      ))}
      {message && <div className="message">{message}</div>}
    </div>
  );
}
