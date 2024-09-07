interface ValidationErrors {
    title: string;
    typeOfWork: string;
    author: string;
  }
  
  interface ValidationLabels {
    [key: string]: string;
  }
  
  export function validateInputs(inputData: { [key: string]: string }, labels: ValidationLabels): { validationErrors: ValidationErrors, isValid: boolean } {
    let validationErrors: ValidationErrors = {
      title: '',
      typeOfWork: '',
      author: ''
    };
    let isValid = true;
  
    for (const key in inputData) {
      if (inputData[key].trim() === '') {
        const label = labels[key] || key;
        validationErrors[key as keyof ValidationErrors] = `Por favor, insira um ${label} válido.`;
        isValid = false;
      }
    }
  
    return { validationErrors, isValid };
  }
  