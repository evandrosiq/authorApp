interface ValidationErrors {
  title: string;
  typeOfWork: string;
  author: string;
}
const labels = {
  title: "Título",
  typeOfWork: "Tipo de Obra",
  author: "Autor",
};

export function validateInputs(inputData: { [key: string]: string }): { validationErrors: ValidationErrors, isValid: boolean } {
  const validationErrors: ValidationErrors = {
    title: '',
    typeOfWork: '',
    author: ''
  };
  
  let isValid = true;
  
  for (const key in inputData) {
    const value = inputData[key];
    if (typeof value === 'string' && value.trim() === '') {
      const label = labels[key as keyof ValidationErrors]  || key;
      validationErrors[key as keyof ValidationErrors] = `Por favor, insira um ${label} válido.`;
      isValid = false;
    }
  }

  return { validationErrors, isValid };
}
