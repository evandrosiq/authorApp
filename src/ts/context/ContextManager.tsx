import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Author } from '../services/AuthorRepository';

interface ApplicationContextType {
    tableData: Author[] | null;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const useApplicationContext = () => {
    const context = useContext(ApplicationContext);

    if (!context) {
        throw new Error('useApplicationContext deve ser usado dentro de um ApplicationContextProvider');
    }

    return context;
};

interface ApplicationContextProviderProps {
    children: ReactNode;
    tableData: Author[] | null;
}

export const ApplicationContextProvider = ({ children, tableData }: ApplicationContextProviderProps) => {
    const [tableContext, setTableContext] = useState<Author[] | null>(tableData);

    useEffect(() => {
        setTableContext(tableData);
    }, [tableData]);

    return (
        <ApplicationContext.Provider value={{ tableData: tableContext }}>
            {children}
        </ApplicationContext.Provider>
    );
};
