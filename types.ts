import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { z, ZodType } from "zod";

export type FormData = {
  exerciseName: string;
  exerciseDescription?: string;
  isTimeBased: boolean;
  primaryMuscleGroupId: number;
  secondaryMuscleGroupId?: number;
};

export const UserSchema: ZodType<FormData> = z.object({
  exerciseName: z.string(),
  exerciseDescription: z.string().optional(),
  isTimeBased: z.boolean(),
  primaryMuscleGroupId: z.number(),
  secondaryMuscleGroupId: z.number(),
});

export type FormFieldProps = {
  type: "text" | "number" | "boolean" | "select" | "textarea";
  placeholder?: string;
  name: ValidFieldNames;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  validationOptions?: RegisterOptions;
  children?: React.ReactNode;
};

export type ValidFieldNames =
  | "exerciseName"
  | "exerciseDescription"
  | "isTimeBased"
  | "primaryMuscleGroupId"
  | "secondaryMuscleGroupId";
