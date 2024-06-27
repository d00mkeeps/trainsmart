"use client";
import ReactSelectField from "../../components/ReactSelectField";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormField from "../FormField";
import {
  UserProfile,
  CreateExerciseFormData,
  CreateExerciseSchema,
  RetrievedExercise,
  ExerciseData,
} from "../../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import fetchUserProfiles, {
  fetchUserExercises,
  updateExercise,
} from "../../supabasefunctions";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(url, key);
const muscleGroups = [
  { key: 6, value: "Abdominals" },
  { key: 15, value: "Biceps" },
  { key: 1, value: "Calves" },
  { key: 18, value: "Cardiovascular system" },
  { key: 11, value: "Chest" },
  { key: 17, value: "Forearms" },
  { key: 14, value: "Front delts" },
  { key: 4, value: "Glutes" },
  { key: 3, value: "Hamstrings" },
  { key: 5, value: "Hip flexors" },
  { key: 9, value: "Lats" },
  { key: 13, value: "Lateral delts" },
  { key: 8, value: "Lower back" },
  { key: 7, value: "Obliques" },
  { key: 2, value: "Quads" },
  { key: 12, value: "Rear delts" },
  { key: 10, value: "Traps" },
  { key: 16, value: "Triceps" },
];

function Form() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const muscleGroupOptions = muscleGroups.map((group) => ({
    value: group.key,
    label: group.value,
  }));
  const [exercises, setExercises] = useState<RetrievedExercise[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    control,
    setValue,
  } = useForm<CreateExerciseFormData>({
    resolver: zodResolver(CreateExerciseSchema), // Apply the zodResolver
  });
  const handleExerciseSelect = (exerciseId: number | string) => {
    const selectedExercise = exercises.find((ex) => ex.id === exerciseId);
    if (selectedExercise) {
      setValue("exerciseName", selectedExercise.name);
      setValue(
        "exerciseDescription",
        selectedExercise.description || undefined
      );
      setValue("isTimeBased", selectedExercise.is_time_based);
      setValue(
        "primaryMuscleGroupId",
        selectedExercise.primary_muscle_group_id
      );
      setValue(
        "secondaryMuscleGroupId",
        selectedExercise.secondary_muscle_group_id || undefined
      );
    }
  };
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitted) {
      timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 1000);
    }
  });
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const userProfile = await fetchUserProfiles();
        setUserProfile(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
    loadUserProfile();
  }, []);
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
  }, [userProfile]);
  console.log(exercises);

  //TODO: consiter looking over typing to find possible simplifications
  const onSubmit = async (data: ExerciseData) => {
    if (!userProfile) {
      console.error("user profile not loaded");
      return;
    }
    if (!data.selectedExerciseId) {
      console.error("No exercise selected");
      setError("selectedExerciseId", {
        type: "manual",
        message: "Please select an exercise",
      });
      return;
    }

    try {
      const updatedExercise = {
        id: data.selectedExerciseId,
        name: data.exerciseName,
        description: data.exerciseDescription ?? null,
        is_time_based: data.isTimeBased,
        primary_muscle_group_id: data.primaryMuscleGroupId,
        secondary_muscle_group_id: data.secondaryMuscleGroupId ?? null,
        user_id: userProfile.user_id,
        is_template: false,
      };

      const result = await updateExercise(supabase, updatedExercise);
      if (result.success) {
        console.log("Exercise updated successfully:", result);
        setIsSubmitted(true);
        reset();
      } else {
        console.log("Failed to update exercise:", result.error);
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
        <h1 className="text-3xl font-bold mb-4">Edit Exercises</h1>
        <ReactSelectField<CreateExerciseFormData>
          name="selectedExerciseId"
          label="Choose an exercise"
          options={exerciseOptions}
          control={control}
          isClearable
          onExerciseSelect={handleExerciseSelect}
        />
        <FormField
          type="text"
          placeholder="exercise name"
          name="exerciseName"
          register={register}
          error={errors.exerciseName}
          required={true}
        />
        <FormField
          type="textarea"
          placeholder="description (optional)"
          name="exerciseDescription"
          register={register}
          error={errors.exerciseDescription}
        />
        <FormField
          type="boolean"
          label="Is this a time based exercise?"
          name="isTimeBased"
          register={register}
          error={errors.isTimeBased}
          valueAsNumber
        />
        <ReactSelectField<CreateExerciseFormData>
          name="primaryMuscleGroupId"
          label="Primary Muscle Group"
          options={muscleGroupOptions}
          control={control}
          isClearable
        />
        <ReactSelectField<CreateExerciseFormData>
          name="secondaryMuscleGroupId"
          label="Secondary Muscle Group"
          options={muscleGroupOptions}
          control={control}
          isClearable
        />
        <button type="submit" className="submit-button" disabled={isSubmitted}>
          {isSubmitted ? "Exercise edited!" : "Update"}
        </button>
      </div>
    </form>
  );
}

export default Form;
