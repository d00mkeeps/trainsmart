import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { errorMonitor } from "stream";
import { UserProfile, NewExercise } from "@/types";

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
