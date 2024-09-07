import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ApplicationContextProviderProps,
  ApplicationContextType,
  Author,
} from "../general";
import { getAll } from "../services/AuthorService";

export const ApplicationContext = createContext<
  ApplicationContextType | undefined
>(undefined);

export const ApplicationContextProvider = ({
  children,
}: ApplicationContextProviderProps) => {
  const location = useLocation();
  const [tableContext, setTableContext] = useState<Author[] | null>(null);

  const allItems = useMemo(() => {
    return getAll() ?? [];
  }, [location.pathname]);

  useEffect(() => {
    const authors = allItems;
    setTableContext(authors);
  }, [allItems]);

  return (
    <ApplicationContext.Provider
      value={{ tableData: tableContext, setTableData: setTableContext }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
