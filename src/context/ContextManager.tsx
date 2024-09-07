import { createContext, useContext, useState, useEffect } from 'react';
import { ApplicationContextProviderProps, ApplicationContextType, Author } from '../../types/AuthorTypes';


const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const useApplicationContext = () => {
    const context = useContext(ApplicationContext);

    if (!context) {
        throw new Error('useApplicationContext deve ser usado dentro de um ApplicationContextProvider');
    }

    return context;
};

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
