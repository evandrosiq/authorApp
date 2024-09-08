import { validateInputs } from "../validation/validateInputs";

export function useAuthorValidation(newItem: { [key: string]: string }) {
  const labels = {
    title: "Título",
    typeOfWork: "Tipo de Obra",
    author: "Autor",
  };

  return validateInputs(newItem, labels);
}
