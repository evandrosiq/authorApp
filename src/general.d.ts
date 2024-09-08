import { Dispatch, ReactNode, SetStateAction } from "react";
import { SingleValue } from "react-select";

export interface Author {
  id: string;
  index: number;
  title: string;
  typeOfWork: string;
  author: string;
  lastModify: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface ComboboxProps {
  onChange: (selectedOption: SingleValue<Option> | null) => void;
  defaultValue?: Option;
}

export interface DataTableProps {
  tableData: Author[] | null;
}

export interface InputProps {
  id: string;
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
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
