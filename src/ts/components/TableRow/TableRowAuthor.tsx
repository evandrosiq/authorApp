import { EditIcon, DeleteIcon } from '../../assets/icons'; 
import { deleteItem, getById, update } from '../../services/AuthorRepository'; 

interface TableRowProps {
  id: string;
  index: number;
  author: string;
  typeOfWork: string;
  title: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function TableRowAuthor({ id, index, author, typeOfWork, title, onSuccess, onError }: TableRowProps) {
  const handleEdit = async () => {
    try {
      const item = getById(id);
      if (item) {
        // Implementar a lógica de edição, por exemplo, abrir um modal para editar o item
        const updatedData = { ...item, title: "Novo título" }; // Exemplo de alteração
        update(id, updatedData);
        onSuccess("Item atualizado com sucesso!");
      } else {
        onError("Item não encontrado para edição.");
      }
    } catch (error) {
      onError("Erro ao editar o item.");
    }
  };

  const handleDelete = () => {
    try {
      deleteItem(id);
      onSuccess("Item deletado com sucesso!");
    } catch (error) {
      onError("Erro ao deletar o item.");
    }
  };

  return (
    <tr className="table__row" role="row" tabIndex={index}>
      <td className="table__cell" role="cell">{author}</td>
      <td className="table__cell" role="cell">{typeOfWork}</td>
      <td className="table__cell" role="cell">{title}</td>
      <td className="table__cell" role="cell">
        <button className="table__btn btn-edit" title="Editar" onClick={handleEdit}>
          <EditIcon />
        </button>
        <button className="table__btn btn-delete" title="Excluir" onClick={handleDelete}>
          <DeleteIcon />
        </button>
      </td>
    </tr>
  );
}
