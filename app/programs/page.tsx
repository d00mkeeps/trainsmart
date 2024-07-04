"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  fetchUserProfiles,
  fetchUserPrograms,
  deleteProgram,
} from "@/app/supabase";
import { UserProfile } from "../types/profile-types";
import { Program } from "../types/program-types";
import Link from "next/link";
import ActionButton from "../components/ActionButton";
import { PencilIcon } from "@heroicons/react/24/solid";

const ProgramPage = () => {
  const [userPrograms, setUserPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (selectedProgramId: number) => {
    setTimeout(async () => {
      if (window.confirm("Are you sure you want to delete this program?")) {
        try {
          const result = await deleteProgram(selectedProgramId);
          if (result.success) {
            setUserPrograms((prevPrograms) =>
              prevPrograms.filter((program) => program.id !== selectedProgramId)
            );
          } else {
            const errorMessage =
              result.error instanceof Error
                ? result.error.message
                : String(result.error);
            throw new Error(errorMessage);
          }
        } catch (error) {
          console.error("Failed to delete program :(  ", error);
          //TODO: add logic to display message to user here
          setError("Failed to delete program, please try again.");
        }
      }
    }, 100);
  };
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
                <ActionButton
                  href={`/programs/edit/${program.id}`}
                  label="Edit"
                  icon={<PencilIcon className="w-4 h-4" />}
                  variant="primary"
                  className="mt-2"
                />
                <ActionButton
                  href="#"
                  label="delete"
                  variant="danger"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleDelete(program.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProgramPage;
