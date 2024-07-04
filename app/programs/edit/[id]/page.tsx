"use client";
import Link from "next/link";
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
} from "@/app/supabaseFunctions";
import { UserProfile } from "@/app/profile/profile-types";

interface EditProgramFormData {
  programName: string;
  description: string;
  selectedWorkout: number | null;
}

const EditProgramPage = React.memo(() => {
  const [workoutsKey, setWorkoutsKey] = useState(0);
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
  }, [currentProgramId]);

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
  const handleWorkoutCreated = () => {
    setWorkoutsKey((prevKey) => prevKey + 1);
    setIsWorkoutModalOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <div className="relative mb-8">
          <Link
            href="/programs"
            className="absolute top-0 left-0 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-semibold text-center">Edit Program</h1>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Updating..." : "Update Program"}
          </button>
        </div>

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

        <form className="max-w-md mx-auto space-y-4">
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
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <WorkoutSelectField
                key={workoutsKey}
                name="selectedWorkout"
                control={control}
                label="Select a Workout"
                placeholder="Search"
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
              Add new workout
            </button>
          </div>
        </form>

        <WorkoutModal
          isOpen={isWorkoutModalOpen}
          onClose={() => setIsWorkoutModalOpen(false)}
          onWorkoutCreated={handleWorkoutCreated}
          currentProgramId={currentProgramId}
        />
      </main>
    </div>
  );
});
export default EditProgramPage;
