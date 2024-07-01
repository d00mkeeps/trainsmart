"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Header from "@/app/components/Header";
import fetchUserProfiles, { updateUserProfile } from "@/app/supabasefunctions";
import { UserProfile } from "../profile-types";

const EditProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfile>();

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const profile = await fetchUserProfiles();
        if (profile) {
          Object.keys(profile).forEach((key) => {
            setValue(
              key as keyof UserProfile,
              profile[key as keyof UserProfile]
            );
          });
        }
      } catch (err) {
        setError("failed to load user profile");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserProfile();
  }, [setValue]);

  const onSubmit = async (data: UserProfile) => {
    try {
      await updateUserProfile(data);
      router.push("/profile");
    } catch (err) {
      setError("failed to update profile!");
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="first_name"
            >
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="first_name"
              {...register("first_name", {
                required: "First name is required",
              })}
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs italic">
                {errors.first_name.message}
              </p>
            )}
          </div>
          {/* Add more input fields for other profile attributes */}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
export default EditProfilePage;
