// components/UserProfileFormField.tsx
import React from "react";
import { UseFormRegister, FieldErrors, RegisterOptions } from "react-hook-form";
import { UserProfile } from "../profile/profile-types";

type FieldProps = {
  name: keyof UserProfile;
  label: string;
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
  type?: string;
  required?: boolean;
  validation?: Omit<
    RegisterOptions<UserProfile, keyof UserProfile>,
    "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  step?: string;
};

const UserProfileFormField: React.FC<FieldProps> = ({
  name,
  label,
  register,
  errors,
  type = "text",
  required = false,
  validation = {},
  step,
}) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={name}
        type={type}
        step={step}
        {...register(name, {
          required: required ? `${label} is required` : false,
          ...validation,
        })}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs italic">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default UserProfileFormField;
