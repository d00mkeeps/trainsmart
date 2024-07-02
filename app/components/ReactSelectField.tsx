import React from "react";
import Select, { components, OptionProps } from "react-select";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import ActionButton from "./ActionButton";

export interface Option {
  value: number;
  name: string;
  isTemplate?: boolean;
  description?: string | null;
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
  onModify?: (value: number) => void;
}
interface CustomSelectProps {
  onEdit?: (value: number) => void;
  onDelete?: (value: number) => void;
  onModify?: (value: number) => void;
}

const CustomOption: React.FC<OptionProps<Option, false> & CustomSelectProps> = (
  props
) => {
  const { onEdit, onDelete, onModify } = props;
  const { name, description, isTemplate, value } = props.data;
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        <span>
          {name}
          {isTemplate ? (
            <span className="ml-2">(template)</span>
          ) : (
            <span className="ml-2">
              | {description ? description : <i>No Description</i>}
            </span>
          )}
        </span>
        <div>
          {isTemplate && onModify ? (
            <ActionButton
              href="#"
              label="Modify"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onModify(value);
              }}
            />
          ) : (
            <>
              {onEdit && (
                <ActionButton
                  href="#"
                  label="Edit"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(value);
                  }}
                />
              )}
              {onDelete && (
                <ActionButton
                  href="#"
                  label="Delete"
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(props.data.value);
                  }}
                />
              )}
            </>
          )}
        </div>
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
  onModify,
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
                  onModify={onModify}
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
