import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, Controller } from "react-hook-form";
import { WorkoutOption, WorkoutSelectFieldProps } from "../types/workout-types";
import Select, { components, OptionProps } from "react-select";
import {
  fetchUserProfiles,
  deleteWorkout,
  fetchUserProgramWorkouts,
} from "@/app/supabase";

const WorkoutSelectField = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  programId,
  onWorkoutSelect,
}: WorkoutSelectFieldProps<TFieldValues>) => {
  const [workouts, setWorkouts] = useState<WorkoutOption[]>([]);
  const memoizedWorkouts = useMemo(() => workouts, [workouts]);
  const loadWorkouts = useCallback(async () => {
    const userProfile = await fetchUserProfiles();
    if (userProfile) {
      const workoutsResult = await fetchUserProgramWorkouts(
        userProfile.user_id,
        programId
      );

      if (workoutsResult.success && workoutsResult.data) {
        setWorkouts(
          workoutsResult.data.map((workout) => ({
            value: workout.id,
            label: workout.workout_name,
            description: workout.description,
          }))
        );
      }
    }
  }, [programId]);

  useEffect(() => {
    loadWorkouts();
  }, [programId]);

  const handleDelete = async (workoutId: number) => {
    try {
      const result = await deleteWorkout(workoutId);
      if (result.success) {
        await loadWorkouts(); // Reload workouts after deletion
      } else {
        console.error("Failed to delete workout:", result.error);
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const CustomOption = React.memo(
    (props: OptionProps<WorkoutOption, false>) => {
      const { data, ...rest } = props;
      const { label, description, value } = data;
      return (
        <components.Option {...rest} data={data}>
          <div className="flex items-center justify-between">
            <div>
              <span>{label}</span>
              {description && (
                <span className="ml-2 text-gray-500">{description}</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent select from opening/closing
                handleDelete(value);
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
            >
              Delete
            </button>
          </div>
        </components.Option>
      );
    }
  );

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select<WorkoutOption, false>
            {...field}
            options={workouts}
            placeholder={placeholder}
            value={
              workouts.find((option) => option.value === field.value) || null
            }
            onChange={(selectedOption) => {
              field.onChange(selectedOption ? selectedOption.value : null);
              if (onWorkoutSelect) {
                onWorkoutSelect(selectedOption ? selectedOption.value : null);
              }
            }}
            components={{
              Option: CustomOption,
            }}
            isSearchable={true}
          />
        )}
      />
    </div>
  );
};
export default WorkoutSelectField;
