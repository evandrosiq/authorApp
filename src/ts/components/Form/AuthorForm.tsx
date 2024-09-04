import React, { useState } from 'react';
import { create } from '../../services/AuthorRepository';
import { Combobox } from '../Combobox/Combobox';

export function AuthorForm() {
  // Estado para armazenar os valores do formulário
  const [newItem, setNewItem] = useState({
    title: '',
    typeOfWork: '',  // Este campo será atualizado pelo Combobox
    author: ''
  });

  // Estado para mensagens de erro de validação
  const [errors, setErrors] = useState({
    title: '',
    typeOfWork: '',
    author: ''
  });

  // Função para lidar com mudanças nos inputs de texto
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setNewItem(prevItem => ({ ...prevItem, [name]: value }));
  }


  // Função para validar os dados do formulário
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

  // Função para lidar com o envio do formulário
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (validate()) {
      // Cria um novo item com um ID único e a data de modificação
      const item = {
        ...newItem,
        id: Date.now().toString(),
        lastModify: new Date().toISOString()
      };

      // Chama a função de criação do AuthorRepository
      create(item);

      // Limpa o formulário após o cadastro
      setNewItem({ title: '', typeOfWork: '', author: '' });
    }
  }

  return (
    <div className='form'>
      <h2 className='form__title'>Cadastrar</h2>
      <form className='form__wrapper' onSubmit={handleSubmit}>
        <div className='form__input-content'>
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newItem.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className='form__input-content'>
          <label htmlFor="typeOfWork">Tipo</label>
          <Combobox/>
        </div>

        <div className='form__input-content'>
          <label htmlFor="author">Autor</label>
          <input
            type="text"
            id="author"
            name="author"
            value={newItem.author}
            onChange={handleChange}
          />
          {errors.author && <span className="error">{errors.author}</span>}
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
