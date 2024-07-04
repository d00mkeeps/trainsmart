"use client";
import { muscleGroups } from "@/app/constants/muscleGroups";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "../../../components/Header";
import FormField from "../../../components/ExerciseFormField";
import {
  CreateExerciseFormData,
  CreateExerciseSchema,
  RetrievedExercise,
} from "../../../types/exercise-types";
import { fetchUserExercises, updateExercise } from "@/app/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { convertToMuscleGroupOptions } from "../../create-from-template/[id]/page";
import MuscleGroupSelectField from "@/app/components/MuscleGroupSelectField";

const supabase = createClientComponentClient();

export default function EditExercisePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [exercise, setExercise] = useState<RetrievedExercise | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<CreateExerciseFormData>({
    resolver: zodResolver(CreateExerciseSchema),
  });

  useEffect(() => {
    fetchExercise();
  }, [params.id]);

  const fetchExercise = async () => {
    const exercises = await fetchUserExercises(1, parseInt(params.id));
    if (exercises && exercises.length > 0) {
      const fetchedExercise = exercises[0];
      setExercise(fetchedExercise);
      populateForm(fetchedExercise);
    }
  };

  const populateForm = (exercise: RetrievedExercise) => {
    setValue("exerciseName", exercise.name);
    setValue("exerciseDescription", exercise.description || undefined);
    setValue("isTimeBased", exercise.is_time_based);
    setValue("primaryMuscleGroupId", exercise.primary_muscle_group_id);
    setValue(
      "secondaryMuscleGroupId",
      exercise.secondary_muscle_group_id || undefined
    );
  };

  const onSubmit = async (data: CreateExerciseFormData) => {
    if (!exercise) return;

    try {
      const updatedExercise = {
        id: exercise.id,
        name: data.exerciseName,
        description: data.exerciseDescription ?? null,
        is_time_based: data.isTimeBased,
        primary_muscle_group_id: data.primaryMuscleGroupId,
        secondary_muscle_group_id: data.secondaryMuscleGroupId ?? null,
        user_id: exercise.user_id,
        is_template: exercise.is_template,
      };

      const result = await updateExercise(supabase, updatedExercise);
      if (result.success) {
        console.log("Exercise updated successfully:", result);
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/exercises"); // Redirect to exercises list page
        }, 200);
      } else {
        console.log("Failed to update exercise:", result.error);
      }
    } catch (error) {
      console.error("error submitting form:", error);
      alert("Submitting form failed!");
    }
  };

  const muscleGroupOptions = convertToMuscleGroupOptions(muscleGroups);

  if (!exercise) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid col-auto">
          <h1 className="text-3xl font-bold mb-4">Edit Exercise</h1>
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
            placeholder="Choose..."
            label="Primary Muscle Group"
            options={muscleGroupOptions}
            control={control}
            isClearable
          />
          <MuscleGroupSelectField<CreateExerciseFormData>
            name="secondaryMuscleGroupId"
            label="Secondary Muscle Group"
            options={muscleGroupOptions}
            control={control}
            placeholder="Choose..."
            isClearable
          />
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitted}
          >
            {isSubmitted ? "Exercise updated!" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
