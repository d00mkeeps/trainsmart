"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import fetchUserProfiles from "../supabasefunctions";
import { ProfileField, UserProfile } from "./profile-types";
import Link from "next/link";

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const profile = await fetchUserProfiles();
        setUserProfile(profile);
      } catch (err) {
        setError("failed to load user profile!");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div> Error: {error}</div>;
  if (!userProfile) return <div>No user profile found...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileField label="First Name" value={userProfile.first_name} />
            <ProfileField label="Last Name" value={userProfile.last_name} />
            <ProfileField label="Username" value={userProfile.username} />
            <ProfileField label="Email" value={userProfile.email} />
            <ProfileField label="Gender" value={userProfile.gender} />
            <ProfileField
              label="Date of Birth"
              value={
                userProfile.date_of_birth
                  ? new Date(userProfile.date_of_birth).toLocaleDateString()
                  : ""
              }
            />
            <ProfileField
              label="Height"
              value={
                userProfile.height
                  ? `${userProfile.height} ${
                      userProfile.is_imperial ? "in" : "cm"
                    }`
                  : "Not provided"
              }
            />
            <ProfileField
              label="Weight"
              value={
                userProfile.weight
                  ? `${userProfile.weight} ${
                      userProfile.is_imperial ? "lbs" : "kg"
                    }`
                  : "Not provided"
              }
            />
            <ProfileField
              label="Measurement System"
              value={
                userProfile.is_imperial !== null
                  ? userProfile.is_imperial
                    ? "Imperial"
                    : "Metric"
                  : "Not set"
              }
            />
            <ProfileField
              label="Account Created"
              value={
                userProfile.created_at
                  ? new Date(userProfile.created_at).toLocaleString()
                  : "Not available"
              }
            />
          </div>
        </div>
      </main>

      <Link
        href="/profile/edit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Edit profile
      </Link>
    </div>
  );
};
export default ProfilePage;
