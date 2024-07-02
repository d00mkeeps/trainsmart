// types.ts

import { z } from "zod";
import {
  FieldError,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

// Exercise types and schemas

// Basic exercise data type
export type ExerciseData = {
  selectedExerciseId: number | null;
  exerciseName: string;
  exerciseDescription?: string;
  isTimeBased: boolean;
  primaryMuscleGroupId: number;
  secondaryMuscleGroupId?: number;
};

// Complete exercise type
export type Exercise = {
  id: number;
  name: string;
  description?: string | null | undefined;
  is_time_based: boolean;
  primary_muscle_group_id: number;
  secondary_muscle_group_id?: number | null;
  user_id: number;
  is_template: boolean;
  time_created: string;
};

// Form data type for creating an exercise
export type CreateExerciseFormData = ExerciseData;

// Form data type for editing an exercise
export type EditExerciseFormData = ExerciseData & {
  exerciseId: number;
};

// Zod schema for validating exercise data
const exerciseDataSchema = z.object({
  selectedExerciseId: z.number().optional(),
  exerciseName: z.string().min(1, "Exercise name is required"),
  exerciseDescription: z.string().optional(),
  isTimeBased: z.boolean(),
  primaryMuscleGroupId: z.number().refine((val) => val !== 222, {
    message: "Please choose a primary muscle group",
  }),
  secondaryMuscleGroupId: z.number().nullable().optional(),
});

export const CreateExerciseSchema = exerciseDataSchema;

export const EditExerciseSchema = exerciseDataSchema.extend({
  exerciseId: z.number(),
});

// Type for creating a new exercise
export type NewExercise = Omit<Exercise, "id" | "time_created">;

// Type for a retrieved exercise
export type RetrievedExercise = Exercise;

// Form data type for exercise forms
export type ExerciseFormData = ExerciseData;

// Props for form field components
export type FormFieldProps<T extends ExerciseData = ExerciseData> = {
  type: "text" | "number" | "boolean" | "select" | "textarea";
  placeholder?: string;
  name: keyof T;
  register: UseFormRegister<T>;
  error: FieldError | undefined;
  onChange?: (option: any) => void;
  valueAsNumber?: boolean;
  label?: string;
  defaultValue?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  validationOptions?: RegisterOptions;
  children?: React.ReactNode;
  required?: boolean;
};
