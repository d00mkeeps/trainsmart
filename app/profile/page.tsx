"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { useUser } from "@/app/context/UserContext";
import DisplayProfile from "../components/profile/DisplayProfile";

const ProfilePage = () => {
  const { user, profile, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !profile) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1>User Profile</h1>
        <DisplayProfile profile={profile} />
      </main>
    </div>
  );
};

export default ProfilePage;
