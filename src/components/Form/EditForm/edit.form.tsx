import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getById, update } from '@/services/AuthorService';
import { InputField } from '@/components/InputField';
import { Combobox, Option } from '@/components/Combobox';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { typeOfWorkOptions } from '@/constants/typeOfWork.options';
import { Author } from '@/general';
import { useAuthorActions } from '@/hooks/useAuthorActions';

interface DataForm {
  title: string;
  author: string;
  typeOfWork: Option;
}

export function EditAuthorForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actions = useAuthorActions();
  const { handleSubmit, control, reset } = useForm<DataForm>();

  useEffect(() => {
    if (id) {
      try {
        const author = getById(id);
        if (author) {
          reset({
            title: author.title,
            author: author.author,
            typeOfWork: typeOfWorkOptions.find(option => option.value === author.typeOfWork.value) || typeOfWorkOptions[0]
          });
        }
      } catch (error) {
        console.error("Erro ao buscar autor:", error);
      }
    }
  }, []);

  const onSubmit: SubmitHandler<DataForm> = (values) => {
    const updatedAuthor = {
      ...values,
      id: id!,
      lastModify: new Date().toISOString(),
    } satisfies Partial<Author>;

    update({
      id: id!,
      authorData: updatedAuthor,
      callback: () => {
        actions.handleSuccess("Editado com sucesso!");
        navigate('/');
      },
      callbackError: () => actions.handleError("Não foi possível editar!"),
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className='form'>
      <h2 className='form__title'>Editar Autor</h2>
      <form className='form__wrapper' onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Campo Obrigatório" }}
          render={({ field, fieldState }) => (
            <InputField
              id="title"
              label="Título"
              placeholder="Ex.: The Last In Line"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="typeOfWork"
          render={({ field }) => (
            <div className="form__input-content">
              <label htmlFor="typeOfWork">Tipo</label>
              <Combobox
                onChange={(newValue) => field.onChange(newValue)}
                name="typeOfWork"
                options={typeOfWorkOptions}
                defaultValue={field.value}
                value={field.value}
              />
            </div>
          )}
        />

        <Controller
          name="author"
          control={control}
          rules={{ required: "Campo Obrigatório" }}
          render={({ field, fieldState }) => (
            <InputField
              id="author"
              label="Autor"
              placeholder="Ex.: Ronnie James Dio"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <div className='form__content-button'>
          <button type="submit">Salvar</button>
          <button type="button" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
