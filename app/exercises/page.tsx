"use client";

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
      <ExerciseSelectField onExerciseSelect={handleExerciseSelect} />
      <div className="mt-4">
        <p>Check the console to see the selected exercise ID.</p>
        <p>
          The edit button should navigate to the edit page for the selected
          exercise.
        </p>
      </div>
    </div>
  );
}
