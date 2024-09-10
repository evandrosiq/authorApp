import { Combobox, Option } from "@/components/Combobox";
import { InputField } from "@/components/InputField";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { typeOfWorkOptions } from "@/constants/typeOfWork.options";
import { useEffect } from "react";

interface DataForm {
  title: string;
  author: string;
  typeOfWork: Option;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const { handleSubmit, control, reset } = useForm<DataForm>()

  const onSubmit: SubmitHandler<DataForm> = (values) => {
    alert(JSON.stringify(values))
  }

  const handleNavigateToList = () => {
    navigate("/");
  };

  useEffect(() => {
    reset({
      typeOfWork: typeOfWorkOptions[0],
    })
  }, [])

  return (
    <div className="form">
      <h2 className="form__title">Cadastrar</h2>
      <form className="form__wrapper" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          rules={{
            required: "Campo Obrigatório"
          }}
          render={({ field, fieldState }) => (
            <InputField
              id="title"
              label="Título"
              placeholder="Ex.: So What"
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
              <Combobox onChange={(newValue) => field.onChange(newValue)}
                name="typeOfWork"
                options={typeOfWorkOptions}
                defaultValue={field.value ?? typeOfWorkOptions[0]}
                value={field.value}
              />
            </div>
          )}
        />

        <Controller
          name="author"
          control={control}
          rules={{
            required: "Campo Obrigatório"
          }}
          render={({ field, fieldState }) => (
            <InputField
              id="author"
              label="Autor"
              placeholder="Ex.: Miles Davis"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
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
