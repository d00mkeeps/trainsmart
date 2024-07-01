"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Header from "@/app/components/Header";
import fetchUserProfiles, { updateUserProfile } from "@/app/supabasefunctions";
import { UserProfile } from "../profile-types";
import UserProfileFormField from "@/app/components/ProfileFormField";
import ReactSelectField from "@/app/components/ReactSelectField";

const sexOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const EditProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    control,
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
      console.log(data);
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
          <UserProfileFormField
            name="first_name"
            label="First Name"
            register={register}
            errors={errors}
            required
          />
          <UserProfileFormField
            name="last_name"
            label="Last Name"
            register={register}
            errors={errors}
            required
          />
          <UserProfileFormField
            name="username"
            label="Username"
            register={register}
            errors={errors}
            required
          />
          <UserProfileFormField
            name="email"
            label="Email"
            register={register}
            errors={errors}
            type="email"
            required
          />
          <ReactSelectField
            name="gender"
            label="Sex"
            options={sexOptions}
            control={control}
            placeholder="Select"
          />
          <UserProfileFormField
            name="date_of_birth"
            label="Date of Birth"
            register={register}
            errors={errors}
            type="date"
          />
          <UserProfileFormField
            name="height"
            label="Height"
            register={register}
            errors={errors}
            type="number"
            step="0.1"
            validation={{
              min: {
                value: 50,
                message: "Please select a valid height! (50-230)",
              },
              max: {
                value: 230,
                message: "Please select a valid height! (50-230)",
              },
              pattern: {
                value: /^\d+(\.\d{1})?$/,
                message: "Height must have at most one decimal place",
              },
            }}
          />
          <UserProfileFormField
            name="weight"
            label="Weight"
            register={register}
            errors={errors}
            type="number"
            step="0.1"
            validation={{
              min: {
                value: 50,
                message: "Please select a valid weight! (50-300)",
              },
              max: {
                value: 300,
                message: "Please select a valid weight! (50-300)",
              },
              pattern: {
                value: /^\d+(\.\d{1})?$/,
                message: "Weight must have at most one decimal place",
              },
            }}
          />
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("is_imperial")}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Use Imperial System</span>
            </label>
          </div>
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
