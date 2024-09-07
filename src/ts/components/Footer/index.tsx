import { useNavigate } from "react-router-dom";

export function Footer() {
    const navigate = useNavigate();

    function handleNavigateToRegister() {
        navigate('/cadastro');
    }

    return (
        <tfoot className="table__footer" role="rowgroup">
            <tr className="table__row-footer" role="row">
                <td className="table__cell-footer" role="cell">
                    <div className="date">Atualizado em: 01/09/2024</div>
                </td>
                <td className='table__cell-footer table__content-button ' role="cell">
                    <button onClick={handleNavigateToRegister}>Cadastrar</button>
                </td>
            </tr>
        </tfoot>
    );
}
