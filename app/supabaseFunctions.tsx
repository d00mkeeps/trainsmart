import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { errorMonitor } from "stream";
import { RetrievedExercise, UserProfile, NewExercise } from "@/types";

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
  return data;
}

export async function updateExercise(
  supabase: SupabaseClient<any, "public", any>,
  exerciseData: {
    id: any;
    name?: string;
    description?: string | undefined;
    is_time_based?: boolean;
    primary_muscle_group_id?: number;
    secondary_muscle_group_id?: number | undefined;
    user_id?: number;
    is_template?: boolean;
  }
) {
  try {
    const { data, error } = await supabase
      .from("exercises")
      .update(exerciseData)
      .eq("id", exerciseData.id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating exercise:", error);
    return { success: false, error };
  }
}
