import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ReactSelectField from "./ReactSelectField";
import { ExerciseSelectFieldProps } from "../exercises/exercise-types";
import { RetrievedExercise } from "@/types";
import fetchUserProfiles, { fetchUserExercises } from "../supabasefunctions";

const ExerciseSelectField: React.FC<ExerciseSelectFieldProps> = ({
  onExerciseSelect,
}) => {
  const [exercises, setExercises] = useState<RetrievedExercise[]>([]);
  const router = useRouter();
  const { control, setValue } = useForm();

  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadExercises = async () => {
      const userProfile = await fetchUserProfiles();
      if (userProfile) {
        const userExercises = await fetchUserExercises(userProfile.user_id);
        if (userExercises) {
          setExercises(userExercises);
        }
      }
    };

    loadExercises();
  }, []);
  const handleModify = (exerciseId: number) => {
    router.push(`/exercises/create-from-template/${exerciseId}`);
  };
  const handleExerciseSelect = (exerciseId: number | null) => {
    // Handle exercise selection if needed
    console.log("Selected exercise:", exerciseId);
  };

  const handleEdit = (exerciseId: number) => {
    router.push(`/exercises/edit/${exerciseId}`);
  };

  const handleDelete = async (exerciseId: number) => {
    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", exerciseId);

    if (error) {
      console.error("oh no! error deleting exercise: ", error);
    } else {
      setExercises(exercises.filter((ex) => ex.id !== exerciseId));
      setValue("exercise", null); // Clear the select field
    }
  };

  return (
    <div>
      <ReactSelectField
        name="exercise"
        control={control}
        options={exercises.map((ex) => ({
          value: ex.id,
          name: ex.name,
          description: ex.description,
          isTemplate: ex.is_template,
        }))}
        label="Select exercise"
        placeholder="Choose..."
        onExerciseSelect={handleExerciseSelect}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onModify={handleModify}
      />
    </div>
  );
};

export default ExerciseSelectField;
