import { FormFieldProps, ExerciseData } from "@/types";
import React from "react";
import { Path } from "react-hook-form";
function FormField<T extends ExerciseData = ExerciseData>({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
  label,
  required,
  children,
}: FormFieldProps<T>): React.ReactElement {
  const renderField = () => {
    switch (type) {
      case "text":
      case "number":
        return (
          <input
            type={type}
            placeholder={placeholder}
            {...register(name as Path<T>, {
              required: required && "This field is required",
              valueAsNumber,
            })}
          />
        );
      case "textarea":
        return (
          <textarea placeholder={placeholder} {...register(name as Path<T>)} />
        );
      case "boolean":
        return (
          <input
            type="checkbox"
            {...register(name as Path<T>, { valueAsNumber })}
          />
        );
      case "select":
        return (
          <select {...register(name as Path<T>, { required, valueAsNumber })}>
            {children}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {label && <label htmlFor={String(name)}>{label}</label>}
      {renderField()}
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
}

export default FormField;
