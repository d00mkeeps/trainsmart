import { SupabaseClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { RetrievedExercise, NewExercise } from "./exercises/exercise-types";
import { CreateProgramFormData, Program } from "./programs/program-types";
import { UserProfile } from "./profile/profile-types";
import { number } from "zod";
import { error } from "console";

export const supabase = createClientComponentClient();
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

export async function fetchUserPrograms(userId: number) {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("user_id", userId)
      .order("time", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data as Program[],
    };
  } catch (error) {
    console.error("error fetching user programs: ", error);
    return { success: false, error };
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
export async function deleteProgram(selectedProgramId: number) {
  try {
    const { data, error } = await supabase
      .from("programs")
      .delete()
      .eq("id", selectedProgramId);
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error deleting program: ", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
export async function insertProgramWorkout(workoutData: {
  workout_name: string;
  program_id: number;
  user_id: number;
}) {
  try {
    console.log("Inserting workout:", { workoutData });
    const { data, error } = await supabase
      .from("program_workouts")
      .insert({
        workout_name: workoutData.workout_name,
        program_id: workoutData.program_id,
        user_id: workoutData.user_id,
      })
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("error creating workout: ", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export async function fetchUserProgramWorkouts(
  userId: number,
  programId: number
) {
  try {
    const { data, error } = await supabase
      .from("program_workouts")
      .select("*")
      .eq("user_id", userId)
      .eq("program_id", programId);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user programs: ", error);
  }
  return {
    success: false,
    error: error instanceof Error ? error : new Error(String(error)),
  };
}

export async function updateProgram(
  programId: number,
  programData: {
    name: string;
    description: string;
  }
) {
  console.log("Updating program:", { programId, programData });
  try {
    const { data, error } = await supabase
      .from("programs")
      .update({
        name: programData.name,
        description: programData.description,
      })
      .eq("id", programId)
      .select(); // Add this to return the updated row

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      console.warn("No data returned from update operation");
      // Check if the program exists
      const { data: existingProgram, error: checkError } = await supabase
        .from("programs")
        .select()
        .eq("id", programId)
        .single();

      if (checkError || !existingProgram) {
        return { success: false, error: "Program not found" };
      }

      // If the program exists, the update didn't change anything
      return {
        success: true,
        data: existingProgram,
        message: "No changes were made",
      };
    }

    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Error updating program:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
