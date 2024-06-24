import React from "react";
import Select, { StylesConfig, SingleValue } from "react-select";
import { useController, Control, FieldValues, Path } from "react-hook-form";

interface Option {
  value: number | string;
  label: string;
}

interface ReactSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  options: { value: number | string; label: string }[];
  control: Control<TFieldValues>;
  label?: string;
  value?: { value: number; label: string } | number;
  placeholder?: string;
  isClearable?: boolean;
  onChange?: (option: any) => void;
}

function ReactSelectField<TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder = "Select...",
  isClearable = false,
}: ReactSelectProps<TFieldValues>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const selectStyles: StylesConfig<Option, false> = {
    control: (provided) => ({
      ...provided,
      borderColor: error ? "red" : provided.borderColor,
    }),
  };

  const getValue = () =>
    options.find((option) => option.value === value) || null;

  const handleChange = (newValue: SingleValue<Option>) => {
    onChange(newValue?.value);
  };

  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <Select<Option, false>
        options={options}
        onChange={handleChange}
        onBlur={onBlur}
        value={getValue()}
        name={name}
        ref={ref}
        placeholder={placeholder}
        isClearable={isClearable}
        classNamePrefix="react-select"
        styles={selectStyles}
      />
      {error && <p className="text-red-500 text-xs italic">{error.message}</p>}
    </div>
  );
}

export default ReactSelectField;
