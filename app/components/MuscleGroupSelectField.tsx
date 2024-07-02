// MuscleGroupSelectField.tsx
import React from "react";
import Select from "react-select";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface MuscleGroupOption {
  value: number;
  label: string;
}

interface MuscleGroupSelectFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: MuscleGroupOption[];
  label: string;
  placeholder: string;
  isClearable?: boolean;
}

const MuscleGroupSelectField = <TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder,
  isClearable = false,
}: MuscleGroupSelectFieldProps<TFieldValues>) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select<MuscleGroupOption, false>
            {...field}
            options={options}
            placeholder={placeholder}
            isClearable={isClearable}
            isSearchable={true}
            onChange={(selectedOption) => {
              field.onChange(selectedOption ? selectedOption.value : null);
            }}
            value={
              options.find((option) => option.value === field.value) || null
            }
          />
        )}
      />
    </div>
  );
};

export default MuscleGroupSelectField;
