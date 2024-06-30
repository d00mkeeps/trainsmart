import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { errorMonitor } from "stream";
import { RetrievedExercise, UserProfile, NewExercise } from "@/types";
import { CreateProgramFormData } from "./programs/program-types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(url, key);
export default fetchUserProfiles;

async function fetchUserProfiles(): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select()
      .single();
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("User profile not found.");
    }
    const userProfile = data;
    console.log("Fetched user profiles:", userProfile);
    return userProfile;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching user profiles:", err.message);
    } else {
      console.error("An unknown error occured while fetching user profiles");
    }
    return null;
  }
}

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

//fetch exercises

export async function fetchUserExercises(
  userId: number,
  selectedExerciseId: number | null = null
): Promise<RetrievedExercise[] | null> {
  let query = supabase.from("exercises").select("*").eq("user_id", userId);

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
export async function insertProgram(
  programData: CreateProgramFormData,
  userId: number
) {
  try {
    const { data, error } = await supabase
      .from("programs")
      .insert({
        name: programData.programName,
        description: programData.description,
        user_id: userId,
      })
      .select();
    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error creating program:", error);
    return { success: false, error: error };
  }
}
