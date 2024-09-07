import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { customStyles } from './CustomStyles';
import { ComboboxProps, Option } from '../../../types/AuthorTypes';



export function Combobox({ onChange }: ComboboxProps) {
  const options = [
    { value: 'obra', label: 'Obra' },
    { value: 'fonograma', label: 'Fonograma' },
    { value: 'potpourri', label: 'Pot-pourri' }
  ];

  const defaultValue = options[0];
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(defaultValue);

  function handleChange(selectedOption: SingleValue<Option> | null){
    setSelectedOption(selectedOption);
    if (selectedOption) {
      onChange(selectedOption);
    } else {
      onChange(null);
    }
    console.log('Opção selecionada:', selectedOption);
  };

  return (
    <Select
      options={options}
      styles={customStyles}
      isSearchable={false}
      value={selectedOption}
      onChange={handleChange}
      defaultValue={defaultValue}
    />
  );
}
