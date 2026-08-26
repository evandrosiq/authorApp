import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FooterProps } from "../../general";
import { getLastModifiedDate } from "../../services/AuthorService";
import { Pagination } from "../Pagination";

export function Footer({ page, lastValidPage, resultRange, onPageChange }: FooterProps) {
    const navigate = useNavigate();

    function handleNavigateToRegister() {
        navigate('/cadastro');
    }

    const [lastModifiedDate, setLastModifiedDate] = useState<string | null>(null);

    useEffect(() => {
        const date = getLastModifiedDate();
        if (date) {
            setLastModifiedDate(date);
        }
    }, []);

    return (
        <tfoot className="table__footer" role="rowgroup">
            {resultRange.total > 0 && (
                <Pagination
                    page={page}
                    lastValidPage={lastValidPage}
                    resultRange={resultRange}
                    onPageChange={onPageChange}
                />
            )}
            <tr className="table__row-footer" role="row">
                <td className="table__cell-footer" role="cell">
                Atualizado em: {lastModifiedDate ? new Date(lastModifiedDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className='table__cell-footer table__content-button ' role="cell">
                    <button onClick={handleNavigateToRegister}>Cadastrar</button>
                </td>
            </tr>
        </tfoot>
    );
}
