import { useEffect, useState } from 'react'
// import { AuthorForm } from './components/Form/AuthorForm'
import Table from './components/Table'
import { ApplicationContextProvider } from './context/ContextManager'
import { getAll } from './services/AuthorService';
import { Author } from '../types/Author';


function App() {
  const [tableData, setTableData] = useState<Author[] | null>(null);

  useEffect(() => {
    const authors = getAll();
    setTableData(authors);
    return () => { };
  }, []);


  return (
    <ApplicationContextProvider tableData={tableData}>
      <div className='tableMain'>
        <Table />
        {/* <AuthorForm /> */}
      </div>
    </ApplicationContextProvider>
  )
}

export default App
