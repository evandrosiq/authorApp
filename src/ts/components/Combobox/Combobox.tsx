import { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { customStyles } from './CustomStyles';

interface Option {
  value: string;
  label: string;
}

export function Combobox() {
  const options: Option[] = [
    { value: 'obra', label: 'Obra' },
    { value: 'fonograma', label: 'Fonograma' },
    { value: 'potpourri', label: 'Pot-pourri' }
  ];

  const defaultValue: Option = options[0];
  const classNamePrefix = 'combobox';
  const [selectedOption, setSelectedOption] = useState<Option>(defaultValue);



  useEffect(() => {
    handleChange(selectedOption);
  }, []);

  const handleChange = (option: SingleValue<Option>) => {
    if (option) {
      setSelectedOption(option);
      console.log('Opção selecionada:', option);
    }
  };



  return (
    <Select
      options={options}
      styles={customStyles}
      isSearchable={false}
      value={selectedOption}
      onChange={handleChange}
      defaultValue={defaultValue}
      classNamePrefix={classNamePrefix}
    />
  );
}
