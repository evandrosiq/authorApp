import { TableRowProps } from '../../../types/AuthorTypes';
import { EditIcon, DeleteIcon } from '../../assets/icons';
import { deleteItem } from '../../services/AuthorService';
import { useNavigate } from 'react-router-dom';


export function TableRowAuthor({ id, index, author, typeOfWork, title, onSuccess, onError }: TableRowProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editar/${id}`);
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
