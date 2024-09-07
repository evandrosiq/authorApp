import { useState } from "react";
import Select, { SingleValue } from "react-select";
import { ComboboxProps, Option } from "../../general";
import { customStyles } from "./CustomStyles";

export function Combobox({ onChange, defaultValue }: ComboboxProps) {
  const options = [
    { value: "obra", label: "Obra" },
    { value: "fonograma", label: "Fonograma" },
    { value: "potpourri", label: "Pot-pourri" },
  ];

  const [selectedOption, setSelectedOption] = useState<Option | null>(
    defaultValue || options[0]
  );

  function handleChange(selectedOption: SingleValue<Option> | null) {
    setSelectedOption(selectedOption);
    onChange(selectedOption);
  }

  return (
    <Select
      options={options}
      styles={customStyles}
      isSearchable={false}
      value={defaultValue ?? selectedOption}
      onChange={handleChange}
    />
  );
}
