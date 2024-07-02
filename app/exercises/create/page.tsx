"use client";
import { useRouter } from "next/navigation";
import ReactSelectField from "../../components/ReactSelectField";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormField from "../../components/ExerciseFormField";
import {
  NewExercise,
  CreateExerciseFormData,
  CreateExerciseSchema,
} from "../../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import fetchUserProfiles, { insertExercise } from "../../supabasefunctions";
import Header from "@/app/components/Header";
import { UserProfile } from "@/app/profile/profile-types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { convertToMuscleGroupOptions } from "../create-from-template/[id]/page";
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

function Form() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const muscleGroupOptions = convertToMuscleGroupOptions(muscleGroups);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    control,
  } = useForm<CreateExerciseFormData>({
    resolver: zodResolver(CreateExerciseSchema), // Apply the zodResolver
  });
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
  const onSubmit = async (data: CreateExerciseFormData) => {
    if (!userProfile) {
      console.error("user profile not loaded");
      return;
    }

    try {
      const newData = {
        name: data.exerciseName,
        description: data.exerciseDescription || null,
        is_time_based: data.isTimeBased,
        primary_muscle_group_id: data.primaryMuscleGroupId,
        secondary_muscle_group_id: data.secondaryMuscleGroupId || null,
        user_id: userProfile.user_id,
        is_template: false,
      } as NewExercise;
      console.log("new data:", newData);

      const result = await insertExercise(supabase, newData);
      if (result.success) {
        console.log("Exercise inserted successfully:", result);
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/exercises");
        }, 100);
      } else {
        console.log("Failed to insert exercise:", result.error);

        if (result.error?.code === "23505") {
          setError("exerciseName", {
            type: "manual",
            message: "An exercise with this name already exists",
          });
        } else {
          alert("Failed to insert exercise. Please try again.");
        }
      }
    } catch (error) {
      console.error("error submitting form:", error);
      alert("Submitting form failed!");
    }
  };

  return (
    <div>
      <Header />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid col-auto">
          <h1 className="text-3xl font-bold mb-4">Create Exercise</h1>

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
            options={muscleGroupOptions}
            control={control}
            isClearable
            placeholder="Choose..."
          />
          <MuscleGroupSelectField<CreateExerciseFormData>
            name="secondaryMuscleGroupId"
            label="Secondary Muscle Group"
            options={muscleGroupOptions}
            control={control}
            isClearable
            placeholder="Choose..."
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

export default Form;
