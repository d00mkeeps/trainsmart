import { UserProfile } from "@/app/profile/profile-types";
import { supabase } from "./supabaseClient";

export async function fetchUserProfiles(): Promise<UserProfile | null> {
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

export async function updateUserProfile(profile: UserProfile) {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        username: profile.username,
        email: profile.email,
        sex: profile.sex,
        date_of_birth: profile.date_of_birth,
        height: profile.height,
        weight: profile.weight,
        is_imperial: profile.is_imperial,
      })
      .eq("user_id", profile.user_id);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error updating user profile: ", error);
    return { success: false, error: error };
  }
}
