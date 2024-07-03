import {
  UseFormRegister,
  FieldError,
  RegisterOptions,
  FieldValues,
  Control,
  Path,
} from "react-hook-form";
import { z } from "zod";
export interface ExerciseOption {
  value: number;
  label: string;
  isTemplate: boolean;
  description?: string | null;
}
export interface ExerciseSelectFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder: string;
  onExerciseSelect?: (value: number | null) => void;
}

export type ExerciseData = {
  selectedExerciseId: number | null;
  exerciseName: string;
  exerciseDescription?: string;
  isTimeBased: boolean;
  primaryMuscleGroupId: number;
  secondaryMuscleGroupId?: number;
};

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

export type CreateExerciseFormData = ExerciseData;

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
