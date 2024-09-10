import Select, { SingleValue } from "react-select";
import { customStyles } from "./CustomStyles";


export interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  onChange?: (newValue: SingleValue<string | Option> | null) => void;
  defaultValue?: Option;
  value?: SingleValue<string | Option>,
  name?: string,
  options: Option[]
}

export function Combobox({ onChange, defaultValue, value, name, options }: ComboboxProps) {

  function handleChange(newValue: SingleValue<string | Option>) {
    if (onChange)
      onChange(newValue);
  }

  return (
    <Select
      name={name}
      options={options}
      styles={customStyles}
      isSearchable={false}
      value={defaultValue ?? value}
      defaultValue={defaultValue}
      onChange={handleChange}
    />
  );
}
