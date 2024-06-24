import { z } from "zod";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

// Common exercise data structure
export type ExerciseData = {
  exerciseName: string;
  exerciseDescription?: string;
  isTimeBased: boolean;
  primaryMuscleGroupId: number;
  secondaryMuscleGroupId?: number;
};

// Form data for creating a new exercise
export type CreateExerciseFormData = ExerciseData;

// Form data for editing an exercise
export type EditExerciseFormData = ExerciseData & {
  exerciseId: number; // Include the ID for editing
};

// Zod schema for exercise data
const exerciseDataSchema = z.object({
  exerciseName: z.string().min(1, "Exercise name is required"),
  exerciseDescription: z.string().optional(),
  isTimeBased: z.boolean(),
  primaryMuscleGroupId: z.number().refine((val) => val !== 222, {
    message: "Please choose a primary muscle group",
  }),
  secondaryMuscleGroupId: z.number().optional(),
});

// Schema for creating a new exercise
export const CreateExerciseSchema = exerciseDataSchema;

// Schema for editing an exercise
export const EditExerciseSchema = exerciseDataSchema.extend({
  exerciseId: z.number(),
});

// Keeping your existing types
export type UserProfile = {
  user_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string | null;
  height: string | null;
  weight: string | null;
  is_imperial: boolean | null;
  email: string | null;
  created_at: string | null;
  username: string | null;
  password: string | null;
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

export type NewExercise = Omit<Exercise, "id" | "time_created">;
export type RetrievedExercise = Exercise;

// Update this type to use the new ExerciseData
export type ExerciseFormData = ExerciseData;

// Keeping your existing FormFieldProps
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

// Keeping the existing UserSchema for backwards compatibility
export const UserSchema = z.object({
  exerciseName: z.string().min(1, "Required"),
  exerciseDescription: z.string().optional(),
  isTimeBased: z.boolean(),
  primaryMuscleGroupId: z.number().refine((val) => val !== 222, {
    message: "Please choose a primary muscle group",
  }),
  secondaryMuscleGroupId: z.number().optional(),
});

// You might want to keep this for backwards compatibility
export type FormData = z.infer<typeof UserSchema>;
