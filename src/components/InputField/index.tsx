import { InputProps } from "../../general";

export function InputField({ id, label, name, value, onChange, errorMessage, placeholder }: InputProps) {
  return (
    <div className="form__input-content">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {errorMessage && <span className="error">{errorMessage}</span>}
    </div>
  );
}
