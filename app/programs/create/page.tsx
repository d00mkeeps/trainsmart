"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { useForm, SubmitHandler } from "react-hook-form";
import { CreateProgramFormData } from "../../types/program-types";
import ProgramFormField from "../../components/ProgramFormField";
import { insertProgram, fetchUserProfiles } from "@/app/supabase";
import { UserProfile } from "../../types/profile-types";

const CreateProgram: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProgramFormData>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const userProfile = await fetchUserProfiles();
        setUserProfile(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setMessage({ type: "error", text: "Failed to load user profile" });
      }
    }
    loadUserProfile();
  }, []);
  const router = useRouter();
  const onSubmit: SubmitHandler<CreateProgramFormData> = async (data) => {
    if (!userProfile) {
      setMessage({ type: "error", text: "User profile not found" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await insertProgram(data, userProfile.user_id);
      if (result.success) {
        console.log("Program created successfully:", result.data);
        setMessage({ type: "success", text: "Program created successfully!" });
        setTimeout(() => {
          router.push("/programs");
        }, 100);
      } else {
        console.error("Error creating program:", result.error);
        setMessage({
          type: "error",
          text: "Failed to create program. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating program:", error);
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-2xl font-semibold mb-4">Create a new program</h1>
        {message && (
          <div
            className={`mb-4 p-2 ${
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

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating Program..." : "Create Program"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateProgram;
