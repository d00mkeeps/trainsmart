import { FieldValues, Path, Control } from "react-hook-form";
import { Exercise } from "./exercises/exercise-types";

export interface Workout {
  name: string;
  exercises: any;
}

export interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (worokut: Workout) => void;
}

export interface WorkoutOption {
  value: number;
  label: string;
  description?: string | null;
}

export interface WorkoutSelectFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder: string;
  programId: number;
  onWorkoutSelect?: (workoutId: number | null) => void;
}
