import { useEffect, useState } from 'react'
import { AuthorForm } from './components/Form/AuthorForm'
import Table from './components/Table'
import { ApplicationContextProvider } from './context/ContextManager'
import { getAll } from './services/AuthorService';
import { Author } from '../types/AuthorTypes';
import { EditAuthorForm } from './components/Form/EditAuthorForm';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


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
        <ErrorBoundary>
          <Router>
            <Routes>
              <Route path="/" element={<Table />} />
              <Route path="/cadastro" element={<AuthorForm />} />
              <Route path="/editar/:id" element={<EditAuthorForm />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </div>
    </ApplicationContextProvider>
  )
}

export default App
