import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorActions } from "../../hooks/useAuthorActions";
import { create, getAll } from "../../services/AuthorService";
import { validateInputs } from "../../validation/validateInputs";
import { Combobox } from "../Combobox/Combobox";
import { InputField } from "../InputField/InputField";

export function AuthorForm() {
  const { handleError, handleSuccess } = useAuthorActions();
  const navigate = useNavigate();

  const typeOfWorkOptions = [
    { value: "obra", label: "Obra" },
    { value: "fonograma", label: "Fonograma" },
    { value: "potpourri", label: "Pot-pourri" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const [newItem, setNewItem] = useState({
    title: "",
    typeOfWork: typeOfWorkOptions[0].value,
    author: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    typeOfWork: "",
    author: "",
  });

  useEffect(() => {
    const items = getAll();
    if (items && items.length > 0) {
      const maxIndex = Math.max(...items.map((item: { index: number }) => item.index));
      setCurrentIndex(maxIndex + 1);
    }
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
  }

  function handleComboboxChange(
    selectedOption: { value: string; label: string } | null
  ) {
    if (selectedOption) {
      setNewItem((prevItem) => ({
        ...prevItem,
        typeOfWork: selectedOption.value,
      }));
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const labels = {
      title: "Título",
      typeOfWork: "Tipo de Obra",
      author: "Autor",
    };

    const { validationErrors, isValid } = validateInputs(newItem, labels);

    if (isValid) {
      const item = {
        ...newItem,
        id: Date.now().toString(),
        lastModify: new Date().toISOString(),
        index: currentIndex,
      };
      create(item);
      setNewItem({ title: "", typeOfWork: typeOfWorkOptions[0].value, author: "" });
      setCurrentIndex((prevIndex) => prevIndex + 1);
      handleSuccess("Cadastrado com sucesso!");
    } else {
      setErrors(validationErrors);
      handleError("Não foi possível realizar cadastro");
    }
  }

  function handleNavigateToList() {
    navigate("/");
  }

  return (
    <div className="form">
      <h2 className="form__title">Cadastrar</h2>
      <form className="form__wrapper" onSubmit={handleSubmit}>
        <InputField
          id="title"
          label="Título"
          name="title"
          value={newItem.title}
          onChange={handleChange}
          errorMessage={errors.title}
        />

        <div className="form__input-content">
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
        <div className="form__content-button">
          <button type="submit">Salvar</button>
          <button onClick={handleNavigateToList}>Listagem</button>
        </div>
      </form>
    </div>
  );
}
