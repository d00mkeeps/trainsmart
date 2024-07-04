import { supabase } from "./supabaseClient";

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
    console.error("Error fetching user program workouts: ", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export async function deleteWorkout(workoutId: number) {
  try {
    const { data, error } = await supabase
      .from("program_workouts")
      .delete()
      .eq("id", workoutId);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error deleting workout:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
