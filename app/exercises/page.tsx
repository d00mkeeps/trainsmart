"use client";
import Link from "next/link";
import React from "react";
import { useForm, FieldValues } from "react-hook-form";
import ExerciseSelectField from "../components/ExerciseSelectField";
import Header from "../components/Header";

// Define the form values type
interface FormValues extends FieldValues {
  exercise: number | null;
}

export default function TestExerciseSelectPage() {
  // Create the form control
  const { control } = useForm<FormValues>();

  const handleExerciseSelect = (exerciseId: number | null) => {
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
      <ExerciseSelectField<FormValues>
        name="exercise"
        control={control}
        label="Select Exercise"
        placeholder="Choose an exercise"
        onExerciseSelect={handleExerciseSelect}
      />
      <div className="mt-4"></div>
    </div>
  );
}
