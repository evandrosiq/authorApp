import { AuthorDataTable } from "./AuthorDataTable";
import { useApplicationContext } from "../../context/ContextManager";


export function DataTable() {
  const { tableData } = useApplicationContext();
  return <AuthorDataTable tableData={tableData} />;
}
