import { Dispatch, ReactNode, SetStateAction } from "react";

export interface Author {
  id: string;
  title: string;
  typeOfWork: string;
  author: string;
  lastModify: string;
}

export interface DataTableProps {
  tableData: Author[] | null;
}

export interface TableRowProps {
  id: string;
  index: number;
  author: string;
  typeOfWork: string;
  title: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export interface ApplicationContextType {
  tableData: Author[] | null;
  setTableData: Dispatch<SetStateAction<Author[] | null>>;
}

export interface ApplicationContextProviderProps {
  children: ReactNode;
}
