import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getById, update } from '../../services/AuthorService';
import { InputField } from '../InputField/InputField';
import { Combobox } from '../Combobox/Combobox';
import { validateInputs } from '../../validation/validateInputs';
import { useAuthorActions } from '../../hooks/useAuthorActions';


export function EditAuthorForm() {
    const { handleError, handleSuccess } = useAuthorActions();

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [authorData, setAuthorData] = useState({
        id: '',
        title: '',
        typeOfWork: '',
        author: ''
    });
    const [errors, setErrors] = useState({
        title: '',
        typeOfWork: '',
        author: ''
    });

    const options = [
        { value: 'obra', label: 'Obra' },
        { value: 'fonograma', label: 'Fonograma' },
        { value: 'potpourri', label: 'Pot-pourri' }
    ];

    useEffect(() => {
        if (id) {
            const fetchedAuthor = getById(id);
            if (fetchedAuthor) {
                setAuthorData(fetchedAuthor);
            }
        }
    }, [id]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setAuthorData(prevData => ({ ...prevData, [name]: value }));
    }

    function handleComboboxChange(selectedOption: { value: string; label: string } | null) {
        if (selectedOption) {
            setAuthorData(prevData => ({ ...prevData, typeOfWork: selectedOption.value }));
        }
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const labels = {
            title: 'Título',
            typeOfWork: 'Tipo de Obra',
            author: 'Autor'
        };

        const { validationErrors, isValid } = validateInputs(authorData, labels);
        if (isValid) {
            if (authorData) {
                update(authorData.id, authorData);
                handleSuccess("Editado com sucesso!");
                navigate('/');
            }
        } else {
            setErrors(validationErrors);
            handleError("Não foi possível editar");
        }
    }

    function handleCancel() {
        navigate('/');
    }

    if (!authorData) return <div className='form__loading'>Carregando...</div>;

    const defaultTypeOfWorkOption = options.find(option => option.value === authorData.typeOfWork);

    return (
        <div className='form'>
            <h2 className='form__title'>Editar Autor</h2>
            <form className='form__wrapper' onSubmit={handleSubmit}>
                <InputField
                    id="title"
                    label="Título"
                    name="title"
                    value={authorData.title}
                    onChange={handleChange}
                    errorMessage={errors.title}
                />

                <div className='form__input-content'>
                    <label htmlFor="typeOfWork">Tipo</label>
                    <Combobox
                        onChange={handleComboboxChange}
                        defaultValue={defaultTypeOfWorkOption}
                    />
                </div>

                <InputField
                    id="author"
                    label="Autor"
                    name="author"
                    value={authorData.author}
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
