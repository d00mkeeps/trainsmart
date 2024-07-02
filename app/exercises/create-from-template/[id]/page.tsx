"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/app/components/Header";
import FormField from "@/app/components/ExerciseFormField";
import {
  CreateExerciseFormData,
  CreateExerciseSchema,
  RetrievedExercise,
  ExerciseData,
} from "@/types";
import fetchUserProfiles, {
  fetchUserExercises,
  insertExercise,
} from "@/app/supabasefunctions";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserProfile } from "@/app/profile/profile-types";
import MuscleGroupSelectField from "@/app/components/MuscleGroupSelectField";

const supabase = createClientComponentClient();

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
export const convertToMuscleGroupOptions = (groups: typeof muscleGroups) => {
  return groups.map((group) => ({
    value: group.key,
    label: group.value,
  }));
};
export default function CreateFromTemplatePage() {
  const params = useParams();
  const id = params.id as string;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [template, setTemplate] = useState<RetrievedExercise | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const muscleGroupOptions = convertToMuscleGroupOptions(muscleGroups);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<CreateExerciseFormData>({
    resolver: zodResolver(CreateExerciseSchema),
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitted) {
      timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isSubmitted]);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const profile = await fetchUserProfiles();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
    loadUserProfile();
  }, []);

  useEffect(() => {
    async function loadTemplate() {
      if (id && userProfile) {
        try {
          const exercises = await fetchUserExercises(
            userProfile.user_id,
            Number(id)
          );
          if (exercises && exercises.length > 0) {
            setTemplate(exercises[0]);
            setValue("exerciseName", exercises[0].name);
            setValue(
              "exerciseDescription",
              exercises[0].description || undefined
            );
            setValue("isTimeBased", exercises[0].is_time_based);
            setValue(
              "primaryMuscleGroupId",
              exercises[0].primary_muscle_group_id
            );
            setValue(
              "secondaryMuscleGroupId",
              exercises[0].secondary_muscle_group_id || undefined
            );
          }
        } catch (error) {
          console.error("Error fetching template:", error);
        }
      }
    }
    loadTemplate();
  }, [id, userProfile, setValue]);

  const onSubmit = async (data: ExerciseData) => {
    if (!userProfile) {
      console.error("user profile not loaded");
      return;
    }

    try {
      const newExercise = {
        name: data.exerciseName,
        description: data.exerciseDescription ?? null,
        is_time_based: data.isTimeBased,
        primary_muscle_group_id: data.primaryMuscleGroupId,
        secondary_muscle_group_id: data.secondaryMuscleGroupId ?? null,
        user_id: userProfile.user_id,
        is_template: false,
      };

      const result = await insertExercise(supabase, newExercise);
      if (result.success) {
        console.log("Exercise created successfully:", result);
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/exercises");
        }, 150);
      } else {
        console.log("Failed to create exercise:", result.error);
      }
    } catch (error) {
      console.error("error submitting form:", error);
      alert("Submitting form failed!");
    }
  };

  if (!template) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid col-auto">
          <h1 className="text-3xl font-bold mb-4">
            Create Exercise from Template
          </h1>
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
          <MuscleGroupSelectField<CreateExerciseFormData>
            name="primaryMuscleGroupId"
            label="Primary Muscle Group"
            placeholder="Choose..."
            options={muscleGroupOptions}
            control={control}
            isClearable
          />
          <MuscleGroupSelectField<CreateExerciseFormData>
            name="secondaryMuscleGroupId"
            label="Secondary Muscle Group"
            placeholder="Choose..."
            options={muscleGroupOptions}
            control={control}
            isClearable
          />
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitted}
          >
            {isSubmitted ? "Exercise created!" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
