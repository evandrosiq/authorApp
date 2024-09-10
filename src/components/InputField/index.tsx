import React from "react";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}

export function InputField({ id, label, errorMessage, ...rest }: InputProps) {
  return (
    <div className="form__input-content">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        {...rest}
      />
      {errorMessage && <span className="error">{errorMessage}</span>}
    </div>
  );
}
