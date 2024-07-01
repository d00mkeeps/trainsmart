"use client";
import React from "react";
import {
  Path,
  UseFormRegister,
  FieldError,
  Merge,
  FieldErrorsImpl,
} from "react-hook-form";
import { CreateProgramFormData } from "./program-types"; // Adjust the import path as needed
import Select from "react-select";
const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error?.message && typeof error.message === "string") return error.message;
  return "An error occurred";
};

type ProgramFormFieldProps = {
  type: "text" | "textarea" | "select";
  label: string;
  name: Path<CreateProgramFormData>;
  register: UseFormRegister<CreateProgramFormData>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  onChange?: (value: any) => void;
};

export const ProgramFormField: React.FC<ProgramFormFieldProps> = ({
  type,
  label,
  name,
  register,
  error,
  required,
  placeholder,
  options,
  onChange,
}) => {
  const renderField = () => {
    switch (type) {
      case "text":
        return (
          <input
            type="text"
            id={name}
            {...register(name, {
              required: required && "This field is required",
            })}
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      case "textarea":
        return (
          <textarea
            id={name}
            {...register(name, {
              required: required && "This field is required",
            })}
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
      case "select":
        return (
          <Select
            options={options}
            onChange={(selectedOption) => {
              onChange && onChange(selectedOption);
              register(name).onChange({
                target: { name, value: selectedOption?.value },
              });
            }}
            placeholder={placeholder}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-2 font-bold text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {error && (
        <p className="mt-1 text-sm text-red-500">{getErrorMessage(error)}</p>
      )}
    </div>
  );
};
export default ProgramFormField;
