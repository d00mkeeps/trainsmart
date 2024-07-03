import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import fetchUserProfiles, { insertProgramWorkout } from "../supabaseFunctions";
import { UserProfile } from "../profile/profile-types";
import { WorkoutModalProps, WorkoutFormData } from "../workout-types";

const WorkoutModal: React.FC<WorkoutModalProps> = ({
  isOpen,
  onClose,
  onWorkoutCreated,
  currentProgramId,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkoutFormData>();

  useEffect(() => {
    async function loadUserProfile() {
      setIsLoading(true);
      try {
        const profile = await fetchUserProfiles();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserProfile();
  }, []);

  const onSubmit: SubmitHandler<WorkoutFormData> = async (data) => {
    if (isLoading) {
      console.error("User profile is still loading");
      return;
    }
    if (!userProfile?.user_id) {
      console.error("User profile not loaded or user_id is missing");
      return;
    }
    try {
      const result = await insertProgramWorkout({
        workout_name: data.workoutName,
        program_id: currentProgramId,
        user_id: userProfile.user_id,
      });

      if (result.success) {
        console.log("Workout created successfully:", result.data);
        onWorkoutCreated();
        reset();
        onClose();
      } else {
        console.error("Failed to create workout:", result.error);
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error("Error in workout creation:", error);
      // Handle unexpected errors
    }

    reset();
    onClose();
  };

  if (!isOpen) return null;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Create New Workout</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="workoutName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Workout Name
            </label>
            <input
              id="workoutName"
              type="text"
              {...register("workoutName", {
                required: "Workout name is required",
              })}
              className="w-full p-2 border rounded"
              placeholder="Enter workout name"
            />
            {errors.workoutName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.workoutName.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutModal;
