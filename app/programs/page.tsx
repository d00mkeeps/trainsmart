"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import fetchUserProfiles, { fetchUserPrograms } from "@/app/supabasefunctions";
import { UserProfile } from "@/types";
import { Program } from "./program-types";
import Link from "next/link";

const ProgramPage = () => {
  const [userPrograms, setUserPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserPrograms = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userProfile = await fetchUserProfiles();

        if (!userProfile) {
          setError("User profile not found");
          return;
        }

        const result = await fetchUserPrograms(userProfile.user_id);

        if (result.success && result.data) {
          setUserPrograms(result.data);
        } else {
          setError("Failed to fetch programs");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPrograms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-2xl font-semibold mb-4">Your Programs</h1>
        <Link
          href="/programs/create"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Create New Program
        </Link>
        {isLoading && <p>Loading your programs...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPrograms.map((program) => (
              <div key={program.id} className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{program.name}</h2>
                <p className="text-gray-600">
                  {program.description || "No description"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(program.time).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgramPage;
