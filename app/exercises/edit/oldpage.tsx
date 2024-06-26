"use client";
import ReactSelectField from "../../components/ReactSelectField";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import FormField from "../FormField";
import {
  RetrievedExercise,
  EditExerciseFormData,
  EditExerciseSchema,
} from "../../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchUserExercises, updateExercise } from "../../supabasefunctions";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(url, key);

const muscleGroups = [
  { value: 6, label: "Abdominals" },
  { value: 15, label: "Biceps" },
  { value: 1, label: "Calves" },
  { value: 18, label: "Cardiovascular system" },
  { value: 11, label: "Chest" },
  { value: 17, label: "Forearms" },
  { value: 14, label: "Front delts" },
  { value: 4, label: "Glutes" },
  { value: 3, label: "Hamstrings" },
  { value: 5, label: "Hip flexors" },
  { value: 9, label: "Lats" },
  { value: 13, label: "Lateral delts" },
  { value: 8, label: "Lower back" },
  { value: 7, label: "Obliques" },
  { value: 2, label: "Quads" },
  { value: 12, label: "Rear delts" },
  { value: 10, label: "Traps" },
  { value: 16, label: "Triceps" },
];

function EditExerciseForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [exercises, setExercises] = useState<RetrievedExercise[]>([]);
  const [selectedExercise, setSelectedExercise] =
    useState<RetrievedExercise | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<EditExerciseFormData>({
    defaultValues: {
      exerciseName: "",
    },
    resolver: zodResolver(EditExerciseSchema),
  });

  useEffect(() => {
    async function loadExercises() {
      try {
        const exercises = await fetchUserExercises(1);
        if (exercises) {
          setExercises(exercises);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    }
    loadExercises();
  }, []);

  const onSubmit = async (data: EditExerciseFormData) => {
    if (!selectedExercise) {
      console.error("No exercise selected");
      return;
    }

    try {
      const updatedData = {
        id: selectedExercise.id,
        name: selectedExercise.name,
        description: data.exerciseDescription,
        is_time_based: data.isTimeBased,
        primary_muscle_group_id: data.primaryMuscleGroupId,
        secondary_muscle_group_id: data.secondaryMuscleGroupId,
        user_id: selectedExercise.user_id,
        is_template: selectedExercise.is_template,
      };

      const result = await updateExercise(supabase, updatedData);
      if (result.success) {
        console.log("Exercise updated successfully:", result);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 1000);
      } else {
        console.log("Failed to update exercise:", result.error);
        alert("Failed to update exercise. Please try again.");
      }
    } catch (error) {
      console.error("error submitting form:", error);
      alert("Submitting form failed!");
    }
  };

  const exerciseOptions = exercises.map((ex) => ({
    value: ex.id,
    label: ex.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid col-auto">
        <h1 className="text-3xl font-bold mb-4">Edit Exercise</h1>
        <Controller
          name="exerciseName"
          control={control}
          render={({ field }) => (
            <div>
              <ReactSelectField<any>
                {...field}
                options={exerciseOptions}
                label="Exercise Name"
                value={
                  exerciseOptions.find(
                    (option) => String(option.value) === String(field.value)
                  ) || undefined
                }
                onChange={(selectedOption) =>
                  field.onChange(selectedOption?.value)
                }
                control={control}
              />
            </div>
          )}
        />
        <FormField<EditExerciseFormData>
          type="textarea"
          placeholder="description (optional)"
          name="exerciseDescription"
          register={register}
          error={errors.exerciseDescription}
        />
        <FormField<EditExerciseFormData>
          type="boolean"
          label="Is this a time based exercise?"
          name="isTimeBased"
          register={register}
          error={errors.isTimeBased}
          valueAsNumber
        />
        <Controller
          name="primaryMuscleGroupId"
          control={control}
          render={({ field }) => (
            <div>
              <ReactSelectField<EditExerciseFormData>
                {...field}
                options={muscleGroups}
                label="Primary Muscle Group"
                isClearable
                control={control}
              />
            </div>
          )}
        />
        <Controller
          name="secondaryMuscleGroupId"
          control={control}
          render={({ field }) => (
            <div>
              <ReactSelectField<EditExerciseFormData>
                {...field}
                options={muscleGroups}
                label="Secondary Muscle Group"
                isClearable
                control={control}
              />
            </div>
          )}
        />
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitted || !selectedExercise}
        >
          {isSubmitted ? "Exercise updated!" : "Update"}
        </button>
      </div>
    </form>
  );
}

export default EditExerciseForm;
