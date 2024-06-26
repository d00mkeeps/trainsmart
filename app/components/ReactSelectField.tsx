import React from "react";
import Select, { StylesConfig, SingleValue } from "react-select";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface Option {
  value: number | string;
  label: string;
}

interface ReactSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  options: { value: number | string; label: string }[];
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  isClearable?: boolean;
  onChange?: (selectedOption: Option | null) => number | string | null;
  onExerciseSelect?: (exerciseId: number | string) => void
}

function ReactSelectField<TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  onChange,
  placeholder = "Select...",
  isClearable = false,
  onExerciseSelect,
}: ReactSelectProps<TFieldValues>) {
  const selectStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "blue" : provided.borderColor,
    }),
  };

  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Select<Option, false>
            options={options}
            onChange={(selectedOption) => {
              onChange(selectedOption?.value ?? null);
              if (onExerciseSelect && selectedOption) {
                onExerciseSelect(selectedOption.value)
              }
            }}
            onBlur={onBlur}
            value={options.find((option) => option.value === value)}
            placeholder={placeholder}
            isClearable={isClearable}
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        )}
      />
    </div>
  );
}

export default ReactSelectField;
