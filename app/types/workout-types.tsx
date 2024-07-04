import { FieldValues, Path, Control } from "react-hook-form";

export interface Workout {
  name: string;
  exercises: any;
}

export interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgramId: number;
  onWorkoutCreated: () => void;
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
export interface WorkoutFormData {
  workoutName: string;
}