import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAll } from "../../../services/AuthorService";
import { Combobox } from "../../Combobox";
import { InputField } from "../../InputField";
import { useFormHandler } from "../../../hooks/useFormHandler";

export function RegisterForm() {
  const navigate = useNavigate();
  const typeOfWorkOptions = [
    { value: "obra", label: "Obra" },
    { value: "fonograma", label: "Fonograma" },
    { value: "potpourri", label: "Pot-pourri" },
  ];

  const initialData = {
    title: "",
    typeOfWork: typeOfWorkOptions[0].value,
    author: "",
  };

  const { formData, setFormData, errors, handleSubmit } = useFormHandler({
    initialData,
  });

  useEffect(() => {
    updateIndex();
  }, []);

  const updateIndex = () => {
    const items = getAll();
    if (items) {
      const maxIndex = Math.max(...items.map((item: { index: number }) => item.index));
      setFormData((prevData) => ({ ...prevData, index: maxIndex + 1 }));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleComboboxChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      setFormData((prevData) => ({
        ...prevData,
        typeOfWork: selectedOption.value,
      }));
    }
  };

  const handleNavigateToList = () => {
    navigate("/");
  };

  return (
    <div className="form">
      <h2 className="form__title">Cadastrar</h2>
      <form className="form__wrapper" onSubmit={handleSubmit}>
        <InputField
          id="title"
          label="Título"
          name="title"
          placeholder="Ex.: So What"
          value={formData.title}
          onChange={handleInputChange}
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
          placeholder="Ex.: Miles Davis"
          value={formData.author}
          onChange={handleInputChange}
          errorMessage={errors.author}
        />
        <div className="form__content-button">
          <button type="submit">Salvar</button>
          <button type="button" onClick={handleNavigateToList}>
            Listagem
          </button>
        </div>
      </form>
    </div>
  );
}
