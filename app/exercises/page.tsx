"use client";
import Link from "next/link";
import React from "react";
import ExerciseSelectField from "../components/ExerciseSelectField";
import Header from "../components/Header";

export default function TestExerciseSelectPage() {
  const handleExerciseSelect = (exerciseId: number) => {
    console.log("Selected exercise ID:", exerciseId);
  };

  return (
    <div className="container mx-auto px-4">
      <Header />
      <h1 className="text-2xl font-bold my-4">Test Exercise Select Field</h1>
      <Link
        href="/exercises/create"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Create Exercise
      </Link>
      <ExerciseSelectField onExerciseSelect={handleExerciseSelect} />
      <div className="mt-4"></div>
    </div>
  );
}
