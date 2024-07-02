import React from "react";
import Select, { components, OptionProps } from "react-select";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import ActionButton from "./ActionButton";

interface Option {
  value: number;
  label: string;
}

interface ReactSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: Option[];
  label: string;
  placeholder: string;
  isClearable?: boolean;
  onExerciseSelect?: (value: number | null) => void;
  onEdit?: (value: number) => void;
  onDelete?: (value: number) => void;
}
interface CustomSelectProps {
  onEdit?: (value: number) => void;
  onDelete?: (value: number) => void;
}

const CustomOption: React.FC<OptionProps<Option, false> & CustomSelectProps> = (
  props
) => {
  const { onEdit, onDelete } = props;
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        <span>{props.children}</span>
        {onEdit && onDelete && (
          <div>
            <ActionButton
              href="#"
              label="Edit"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(props.data.value);
              }}
            />
            <ActionButton
              href="#"
              label="Delete"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(props.data.value);
              }}
            />
          </div>
        )}
      </div>
    </components.Option>
  );
};
const ReactSelectField = <TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder,
  onExerciseSelect,
  onEdit,
  onDelete,
}: ReactSelectProps<TFieldValues>) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select<Option, false>
            {...field}
            options={options}
            placeholder={placeholder}
            onChange={(selectedOption) => {
              field.onChange(selectedOption ? selectedOption.value : null);
              if (onExerciseSelect) {
                onExerciseSelect(selectedOption ? selectedOption.value : null);
              }
            }}
            value={
              options.find((option) => option.value === field.value) || null
            }
            components={{
              Option: (optionProps) => (
                <CustomOption
                  {...optionProps}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ),
            }}
          />
        )}
      />
    </div>
  );
};
export default ReactSelectField;
