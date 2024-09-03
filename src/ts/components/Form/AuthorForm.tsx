import React, { useState } from 'react';
import { create } from '../../services/AuthorRepository';
import { Combobox } from '../Combobox/Combobox';

export function AuthorForm() {
  // Estado para armazenar os valores do formulário
  const [newItem, setNewItem] = useState({
    title: '',
    typeOfWork: '',
    name: ''
  });

  // Estado para mensagens de erro de validação
  const [errors, setErrors] = useState({
    title: '',
    typeOfWork: '',
    name: ''
  });

  // Função para lidar com mudanças no formulário
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setNewItem(prevItem => ({ ...prevItem, [name]: value }));
  }

  // Função para validar os dados do formulário
  function validate() {
    let validationErrors = { title: '', typeOfWork: '', name: '' };
    let isValid = true;

    if (!newItem.title.trim()) {
      validationErrors.title = 'O título é obrigatório';
      isValid = false;
    }

    if (!newItem.typeOfWork.trim()) {
      validationErrors.typeOfWork = 'O tipo é obrigatório';
      isValid = false;
    }

    if (!newItem.name.trim()) {
      validationErrors.name = 'O nome é obrigatório';
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
      setNewItem({ title: '', typeOfWork: '', name: '' });
    }
  }

  return (
    <div>
      <h2>Cadastrar Novo Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newItem.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div>
          <label htmlFor="typeOfWork">Tipo:</label>
          <Combobox />
          {errors.typeOfWork && <span className="error">{errors.typeOfWork}</span>}
        </div>

        <div>
          <label htmlFor="name">Autor:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newItem.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
