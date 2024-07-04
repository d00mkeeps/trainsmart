import { CreateProgramFormData, Program } from "@/app/programs/program-types";
import { supabase } from "./supabaseClient";

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
      .select();

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      console.warn("No data returned from update operation");
      const { data: existingProgram, error: checkError } = await supabase
        .from("programs")
        .select()
        .eq("id", programId)
        .single();

      if (checkError || !existingProgram) {
        return { success: false, error: "Program not found" };
      }

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
