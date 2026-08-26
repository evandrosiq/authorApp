import { createContext, useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ApplicationContextProviderProps,
  ApplicationContextType,
  Author,
} from "../general";
import { getAll } from "../services/AuthorService";
import { INITIAL_LISTING_STATE, listingReducer } from "../services/ListingService";

export const ApplicationContext = createContext<
  ApplicationContextType | undefined
>(undefined);

export const ApplicationContextProvider = ({
  children,
}: ApplicationContextProviderProps) => {
  const location = useLocation();
  const [tableContext, setTableContext] = useState<Author[] | null>(null);
  const [listingState, dispatchListing] = useReducer(listingReducer, INITIAL_LISTING_STATE);

  useEffect(() => {
    setTableContext(getAll() ?? []);
  }, [location.pathname]);

  return (
    <ApplicationContext.Provider
      value={{
        tableData: tableContext,
        setTableData: setTableContext,
        listingState,
        dispatchListing,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
