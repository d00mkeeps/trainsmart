import React, { useEffect, useState } from "react";
import {
  useForm,
  Control,
  FieldValues,
  Path,
  Controller,
} from "react-hook-form";
import { WorkoutOption, WorkoutSelectFieldProps } from "../workout-types";
import Select, { components, OptionProps } from "react-select";
import fetchUserProfiles, {
  supabase,
  fetchUserProgramWorkouts,
} from "../supabaseFunctions";

const WorkoutSelectField = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  programId,
  onWorkoutSelect,
}: WorkoutSelectFieldProps<TFieldValues>) => {
  const [workouts, setWorkouts] = useState<WorkoutOption[]>([]);

  const loadWorkouts = async () => {
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
  };

  useEffect(() => {
    loadWorkouts();
  }, [programId]);

  const CustomOption: React.FC<OptionProps<WorkoutOption, false>> = (
    props
  ): React.ReactElement => {
    const { label, description } = props.data;

    return (
      <components.Option {...props}>
        <div>
          <span>{label}</span>
          {description && (
            <span className="ml-2 text-gray-500">{description}</span>
          )}
        </div>
      </components.Option>
    );
  };

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
