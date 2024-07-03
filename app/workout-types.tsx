import { Exercise } from "./exercises/exercise-types"

export interface Workout {
    name: string
    exercises: any
}

export interface WorkoutModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (worokut: Workout) => void
}