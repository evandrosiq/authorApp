import { DataTable } from "../DataTable";
import { Footer } from "../Footer";
import { Header } from "../Header";


const Table = () => {
    return (

        <table className='table'>
            <Header />
            <DataTable />
            <Footer />
        </table>
    );
};

export default Table;
