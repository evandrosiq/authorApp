import React, { useState } from 'react';
import { create } from '../../services/AuthorRepository';
import { Combobox } from '../Combobox/Combobox';
import { InputField } from '../InputField/InputField';

export function AuthorForm() {
  const [newItem, setNewItem] = useState({
    title: '',
    typeOfWork: '',
    author: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    typeOfWork: '',
    author: ''
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setNewItem(prevItem => ({ ...prevItem, [name]: value }));
  }

  function handleComboboxChange(selectedOption: { value: string; label: string } | null) {
    if (selectedOption) {
      setNewItem(prevItem => ({ ...prevItem, typeOfWork: selectedOption.value }));
    }
  }
  
  function validate() {
    let validationErrors = { title: '', typeOfWork: '', author: '' };
    let isValid = true;

    if (!newItem.title.trim()) {
      validationErrors.title = 'Por favor, insira um título válido.';
      isValid = false;
    }

    if (!newItem.author.trim()) {
      validationErrors.author = 'Por favor, insira um título válido.';
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (validate()) {
      const item = {
        ...newItem,
        id: Date.now().toString(),
        lastModify: new Date().toISOString()
      };
      create(item);
      setNewItem({ title: '', typeOfWork: '', author: '' });
    }
  }

  return (
    <div className='form'>
      <h2 className='form__title'>Cadastrar</h2>
      <form className='form__wrapper' onSubmit={handleSubmit}>
      <InputField
          id="title"
          label="Título"
          name="title"
          value={newItem.title}
          onChange={handleChange}
          errorMessage={errors.title}
        />

        <div className='form__input-content'>
          <label htmlFor="typeOfWork">Tipo</label>
          <Combobox onChange={handleComboboxChange} />
        </div>

        <InputField
          id="author"
          label="Autor"
          name="author"
          value={newItem.author}
          onChange={handleChange}
          errorMessage={errors.author}
        />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
