import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { errorMonitor } from "stream";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(url, key);

async function fetchUserProfiles() {
  try {
    const { data, error } = await supabase.from("user_profiles").select();
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("User profile not found.");
    }
    console.log("Fetched user profiles:", data);
    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching user profiles:", err.message);
    } else {
      console.error("An unknown error occured while fetching user profiles");
    }
    return null;
  }
}
