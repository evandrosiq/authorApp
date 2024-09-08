import { AuthorDataTable } from "../components/DataTable";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useApplicationContext } from "../hooks/useApplicationContext";

export function HomePage(): React.ReactElement {
  const { tableData } = useApplicationContext();

  return (
    <table className="table">
      <Header />
      <AuthorDataTable tableData={tableData} />
      <Footer />
    </table>
  );
}
