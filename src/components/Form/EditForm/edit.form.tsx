import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getById } from '../../../services/AuthorService';
import { InputField } from '../../InputField';
import { Combobox } from '../../Combobox';
import { useFormHandler } from '../../../hooks/useFormHandler';

export function EditAuthorForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { formData, setFormData, errors, handleSubmit } = useFormHandler({
    initialData: { id: '', title: '', typeOfWork: '', author: '' },
  });

  useEffect(() => {
    if (id) {
      try {
        const author = getById(id);
        if (author) {
          setFormData(author);
        }
      } catch (error) {
        console.error("Erro ao buscar autor:", error);
      }
    }
  }, [id, setFormData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleComboboxChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      setFormData((prevData) => ({ ...prevData, typeOfWork: selectedOption.value }));
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const options = [
    { value: 'obra', label: 'Obra' },
    { value: 'fonograma', label: 'Fonograma' },
    { value: 'potpourri', label: 'Pot-pourri' }
  ];

  return (
    <div className='form'>
      <h2 className='form__title'>Editar Autor</h2>
      <form className='form__wrapper' onSubmit={handleSubmit}>
        <InputField
          id="title"
          label="Título"
          name="title"
          placeholder='Ex.: The Last In Line'
          value={formData.title}
          onChange={handleChange}
          errorMessage={errors.title}
        />

        <div className='form__input-content'>
          <label htmlFor="typeOfWork">Tipo</label>
          <Combobox
            onChange={handleComboboxChange}
            defaultValue={options.find(option => option.value === formData.typeOfWork)}
          />
        </div>

        <InputField
          id="author"
          label="Autor"
          name="author"
          placeholder='Ex.: Ronnie James Dio'
          value={formData.author}
          onChange={handleChange}
          errorMessage={errors.author}
        />

        <div className='form__content-button'>
          <button type="submit">Salvar</button>
          <button type="button" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
