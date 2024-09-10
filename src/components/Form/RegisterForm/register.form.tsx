import { Combobox, Option } from "@/components/Combobox";
import { InputField } from "@/components/InputField";
import { useNavigate } from "react-router-dom";
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { typeOfWorkOptions } from "@/constants/typeOfWork.options";

interface DataForm {
  title: string;
  author: string;
  typeOfWork: Option;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<DataForm>()

  const onSubmit: SubmitHandler<DataForm> = (values) => {
    alert(JSON.stringify(values))
  }

  const handleNavigateToList = () => {
    navigate("/");
  };

  return (
    <div className="form">
      <h2 className="form__title">Cadastrar</h2>
      <form className="form__wrapper" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <InputField
              id="title"
              label="Título"
              placeholder="Ex.: So What"
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
                defaultValue={field.value}
                value={field.value}
              />
            </div>
          )}
        />

        <Controller
          name="author"
          control={control}
          render={({ field }) => (
            <InputField
              id="author"
              label="Autor"
              placeholder="Ex.: Miles Davis"
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
