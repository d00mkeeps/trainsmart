import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import { FormData, UserSchema, UserProfile, NewExercise } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import fetchUserProfiles, {
  insertExercise,
} from "./userprofile/supabaseFunctions";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(url, key);
const muscleGroups = [
  { key: 222, value: "Choose..." },
  { key: 1, value: "Calves" },
  { key: 2, value: "Quads" },
  { key: 3, value: "Hamstrings" },
  { key: 4, value: "Glutes" },
  { key: 5, value: "Hip flexors" },
  { key: 6, value: "Abdominals" },
  { key: 7, value: "Obliques" },
  { key: 8, value: "Lower back" },
  { key: 9, value: "Lats" },
  { key: 10, value: "Traps" },
  { key: 11, value: "Chest" },
  { key: 12, value: "Rear delts" },
  { key: 13, value: "Lateral delts" },
  { key: 14, value: "Front delts" },
  { key: 15, value: "Biceps" },
  { key: 16, value: "Triceps" },
  { key: 17, value: "Forearms" },
  { key: 18, value: "Cardiovascular system" },
];

function Form() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema), // Apply the zodResolver
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
  const onSubmit = async (data: FormData) => {
    if (!userProfile) {
      console.error("user profile not loaded");
      return;
    }

    try {
      const newData = {
        name: data.exerciseName,
        description: data.exerciseDescription,
        is_time_based: data.isTimeBased,
        primary_muscle_group_id: data.primaryMuscleGroupId,
        secondary_muscle_group_id:
          data.secondaryMuscleGroupId === 222
            ? null
            : data.secondaryMuscleGroupId,
        user_id: userProfile.user_id,
        is_template: false,
      } as NewExercise;
      console.log("new data:", newData);

      const result = await insertExercise(supabase, newData);
      if (result.success) {
        console.log("Exercise inserted successfully:", result);
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

        <FormField
          type="select"
          name="primaryMuscleGroupId"
          label="Primary Muscle Group"
          register={register}
          error={errors.primaryMuscleGroupId}
          valueAsNumber
          required={true}
        >
          {muscleGroups.map(({ key, value }) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </FormField>

        <FormField
          type="select"
          name="secondaryMuscleGroupId"
          label="Secondary Muscle Group"
          register={register}
          error={errors.secondaryMuscleGroupId}
          valueAsNumber
        >
          {muscleGroups.map(({ key, value }) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </FormField>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </div>
    </form>
  );
}

export default Form;
