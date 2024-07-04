import { SupabaseClient } from "@supabase/supabase-js";
import { RetrievedExercise, NewExercise } from "@/app/types/exercise-types";
import { supabase } from "./supabaseClient";

export const insertExercise = async (
  supabase: SupabaseClient,
  newData: NewExercise
) => {
  const { data, error } = await supabase
    .from("exercises")
    .insert(newData)
    .single();

  if (error) {
    console.error("Error inserting exercise: ", error);
    return { success: false, error };
  }
  return { success: true, data };
};

export async function fetchUserExercises(
  userId: number,
  selectedExerciseId: number | null = null
): Promise<RetrievedExercise[] | null> {
  let query = supabase
    .from("exercises")
    .select("*")
    .or(`user_id.eq.${userId},is_template.eq.true`);

  if (selectedExerciseId) {
    query = query.eq("id", selectedExerciseId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching exercises:", error);
    return null;
  }
  const userExercises = data;
  return userExercises;
}

export async function updateExercise(
  supabase: SupabaseClient<any, "public", any>,
  exerciseData: {
    id: number;
    name?: string;
    description?: string | null;
    is_time_based?: boolean;
    primary_muscle_group_id?: number;
    secondary_muscle_group_id?: number | null;
    user_id?: number;
    is_template?: boolean;
  }
) {
  try {
    const { data, error } = await supabase
      .from("exercises")
      .update({
        name: exerciseData.name,
        description: exerciseData.description,
        is_time_based: exerciseData.is_time_based,
        primary_muscle_group_id: exerciseData.primary_muscle_group_id,
        secondary_muscle_group_id: exerciseData.secondary_muscle_group_id,
        user_id: exerciseData.user_id,
        is_template: exerciseData.is_template,
      })
      .eq("id", exerciseData.id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating exercise:", error);
    return { success: false, error };
  }
}
