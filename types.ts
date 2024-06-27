import { z } from "zod";
import {
  FieldError,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

// Exercise types/schemas
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
// Zod schema for exercise data
const exerciseDataSchema = z.object({
  selectedExerciseId: z.number().optional(),
  exerciseName: z.string().min(1, "Exercise name is required"),
  exerciseDescription: z.string().optional(),
  isTimeBased: z.boolean(),
  primaryMuscleGroupId: z.number().refine((val) => val !== 222, {
    message: "Please choose a primary muscle group",
  }),
  secondaryMuscleGroupId: z.number().optional(),
});

export const CreateExerciseSchema = exerciseDataSchema;

export const EditExerciseSchema = exerciseDataSchema.extend({
  exerciseId: z.number(),
});

// Keeping your existing types
export type UserProfile = {
  id: number;
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
//Program types and schemas
export const CreateProgramSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().optional(),
  workouts: z.array(
    z.object({
      day: z.object({
        value: z.string(),
        label: z.string(),
      }),
      exercises: z.array(
        z.object({
          name: z.string().min(1, "Exercise name is required"),
        })
      ),
    })
  ),
});

export interface ProgramFormData {
  name: string;
  description?: string;
  isRestDay: boolean;
  day: {
    value: string;
    label: string;
  };
  workouts: any;
}

export type CreateProgramFormData = z.infer<typeof CreateProgramSchema>;

export type ProgramFormFields = {
  name: string;
  description?: string;
  workouts: Array<{
    day: { value: string; label: string };
    exercises: Array<{ name: string }>;
  }>;
};

export type ProgramFormFieldProps = {
  type: "text" | "textarea" | "select";
  label: string;
  name: Path<CreateProgramFormData>;
  register: UseFormRegister<CreateProgramFormData>;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  onChange?: (value: any) => void;
};
