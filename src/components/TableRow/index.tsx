import { useNavigate } from "react-router-dom";
import { DeleteIcon, EditIcon } from "../../assets/icons";
import { TableRowProps } from "../../general";
import { useApplicationContext } from "../../hooks/useApplicationContext";
import { deleteItem, getAll } from "../../services/AuthorService";

export function TableRow({
  id,
  index,
  author,
  typeOfWork,
  title,
  onSuccess,
  onError,
}: TableRowProps) {
  const { setTableData } = useApplicationContext();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editar/${id}`);
  };

  const handleDelete = () => {
    try {
      deleteItem(id);

      const currentData = getAll();
      setTableData(currentData);
      onSuccess("Item deletado com sucesso!");
    } catch (error) {
      onError("Erro ao deletar o item.");
    }
  };

  return (
    <tr className="table__row" role="row" tabIndex={index}>
      <td className="table__cell" role="cell">
        {author}
      </td>
      <td className="table__cell" role="cell">
        {typeOfWork}
      </td>
      <td className="table__cell" role="cell">
        {title}
      </td>
      <td className="table__cell" role="cell">
        <button
          className="table__btn btn-edit"
          title="Editar"
          onClick={handleEdit}
          aria-placeholder="Editar"
        >
          <EditIcon />
        </button>
        <button
          className="table__btn btn-delete"
          title="Excluir"
          onClick={handleDelete}
          aria-placeholder="Deletar"
        >
          <DeleteIcon />
        </button>
      </td>
    </tr>
  );
}
