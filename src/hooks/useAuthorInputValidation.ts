import { ValidateInputs } from "../validation/ValidateInputs";

export function useAuthorValidation(newItem: { [key: string]: string }) {
  const labels = {
    title: "Título",
    typeOfWork: "Tipo de Obra",
    author: "Autor",
  };

  return ValidateInputs(newItem, labels);
}
