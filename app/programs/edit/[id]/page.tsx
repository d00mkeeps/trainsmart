"use client";
import WorkoutSelectField from "@/app/components/WorkoutSelectField";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import WorkoutModal from "../../../components/CreateWorkoutModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProgramFormField } from "@/app/components/ProgramFormField";
import { useParams } from "next/navigation";
import fetchUserProfiles, {
  updateProgram,
  fetchUserPrograms,
  fetchUserProgramWorkouts,
} from "@/app/supabaseFunctions";
import { UserProfile } from "@/app/profile/profile-types";

interface EditProgramFormData {
  programName: string;
  description: string;
  selectedWorkout: number | null;
}

const EditProgramPage = () => {
  const router = useRouter();
  const params = useParams();
  const currentProgramId = Number(params.id);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<EditProgramFormData>();

  useEffect(() => {
    async function loadUserProfileAndProgram() {
      try {
        const profile = await fetchUserProfiles();
        setUserProfile(profile);

        if (profile) {
          const result = await fetchUserPrograms(profile.user_id);
          if (result.success && result.data) {
            const currentProgram = result.data.find(
              (program) => program.id === currentProgramId
            );
            if (currentProgram) {
              setValue("programName", currentProgram.name);
              setValue("description", currentProgram.description || "");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profile or program:", error);
      }
    }
    loadUserProfileAndProgram();
  }, [currentProgramId, setValue]);

  const onSubmit: SubmitHandler<EditProgramFormData> = async (data) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updateProgram(currentProgramId, {
        name: data.programName,
        description: data.description,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: "Program updated successfully!",
        });
        router.push("/programs");
      } else {
        setMessage({
          type: "error",
          text: `Failed to update program: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("error updating program!, ", error);
      setMessage({
        type: "error",
        text: `Failed to update program!`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Edit Program
        </h1>
        {message && (
          <div
            className={`mb-4 p-2 text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
          <ProgramFormField
            type="text"
            label="Program Name"
            name="programName"
            register={register}
            error={errors.programName}
            required
            placeholder="Enter program name"
          />
          <ProgramFormField
            type="textarea"
            label="Description"
            name="description"
            register={register}
            error={errors.description}
            placeholder="Enter program description"
          />
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-grow">
              <WorkoutSelectField
                name="selectedWorkout"
                control={control}
                label="Select Workout"
                placeholder="Choose a workout"
                programId={currentProgramId}
                onWorkoutSelect={(workoutId) =>
                  console.log("Selected workout:", workoutId)
                }
              />
            </div>
            <button
              type="button"
              onClick={() => setIsWorkoutModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Create Workout
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Updating Program..." : "Update Program"}
          </button>
        </form>
        <WorkoutModal
          isOpen={isWorkoutModalOpen}
          onClose={() => setIsWorkoutModalOpen(false)}
          currentProgramId={currentProgramId}
        />
      </main>
    </div>
  );
};

export default EditProgramPage;
