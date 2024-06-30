import { z } from "zod";
import { Path, UseFormRegister, FieldError } from "react-hook-form";

// Schema for creating a new program
export const CreateProgramSchema = z.object({
  programName: z.string().min(1, "Program name is required"),
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

// Type for the form data when creating a program
export type CreateProgramFormData = z.infer<typeof CreateProgramSchema>;

// Interface for program form data
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

// Type for program form fields
export type ProgramFormFields = {
  name: string;
  description?: string;
  workouts: Array<{
    day: { value: string; label: string };
    exercises: Array<{ name: string }>;
  }>;
};

// Props for program form field components
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
