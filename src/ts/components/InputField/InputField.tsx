
interface InputProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

export function InputField({ id, label, name, value, onChange, errorMessage }: InputProps) {
  return (
    <div className="form__input-content">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
      />
      {errorMessage && <span className="error">{errorMessage}</span>}
    </div>
  );
}
