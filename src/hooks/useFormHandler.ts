import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { create, update } from '../services/AuthorService';
import { useAuthorValidation } from './useAuthorInputValidation';
import { useAuthorActions } from './useAuthorActions';

interface UseFormHandlerProps {
  initialData: { id?: string; title: string; typeOfWork: string; author: string };
  currentIndex?: number;
}

export function useFormHandler({
  initialData,
  currentIndex = 0,
}: UseFormHandlerProps) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({ title: '', typeOfWork: '', author: '' });
  const navigate = useNavigate();
  const { handleSuccess, handleError } = useAuthorActions();

  const { isValid, validationErrors } = useAuthorValidation(formData);
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();


    if (isValid) {
      if (formData.id) {
        update(formData.id, formData);
        handleSuccess("Editado com sucesso!");
        navigate('/');
      } else {
        const newItem = {
          ...formData,
          id: Date.now().toString(),
          lastModify: new Date().toISOString(),
          index: currentIndex,
        };
        create(newItem);
        setFormData({ title: '', typeOfWork: initialData.typeOfWork, author: '' });
        handleSuccess("Cadastrado com sucesso!");
      }
    } else {
      setErrors(validationErrors);
      handleError(formData.id ? "Não foi possível editar" : "Não foi possível realizar cadastro");
    }
  }

  return {
    formData,
    setFormData,
    errors,
    handleSubmit,
  };
}
