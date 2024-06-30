"use client";
import React, { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  Path,
  FieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../../exercises/FormField";
import ReactSelectField from "../../components/ReactSelectField";
import {
  CreateProgramSchema,
  CreateProgramFormData,
  ProgramFormData,
  ProgramFormFields,
} from "../../../types";
import ProgramFormField from "../ProgramFormField";

const dayOptions = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];
function CreateProgramForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProgramFormData>({
    resolver: zodResolver(CreateProgramSchema),
    defaultValues: {
      workouts: [],
    },
  });

  const {
    fields: workoutFields,
    append: appendWorkout,
    remove: removeWorkout,
  } = useFieldArray({
    control,
    name: "workouts",
  });

  const onSubmit = (data: CreateProgramFormData) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProgramFormField
        type="text"
        label="Program Name"
        name="name"
        register={register}
        error={errors.name}
        required
      />
      <ProgramFormField
        type="textarea"
        label="Description"
        name="description"
        register={register}
        error={errors.description}
      />

      {workoutFields.map((field, index) => (
        <div key={field.id} className="border p-4 rounded mb-4">
          <ProgramFormField
            type="select"
            label="Day of the week"
            name={`workouts.${index}.day` as Path<CreateProgramFormData>}
            register={register}
            options={dayOptions}
            error={errors.workouts?.[index]?.day as FieldError | undefined}
            required
          />

          {field.exercises.map((exercise, exerciseIndex) => (
            <ProgramFormField
              key={exerciseIndex}
              type="text"
              label={`Exercise ${exerciseIndex + 1}`}
              name={
                `workouts.${index}.exercises.${exerciseIndex}.name` as Path<CreateProgramFormData>
              }
              register={register}
              error={errors.workouts?.[index]?.exercises?.[exerciseIndex]?.name}
              required
            />
          ))}

          <button
            type="button"
            onClick={() => {
              const exercises = [...field.exercises, { name: "" }];
              const updatedWorkout = { ...field, exercises };
              const newWorkouts = [...workoutFields];
              newWorkouts[index] = updatedWorkout;
              // Implement logic to update form state
            }}
            className="mt-2 bg-green-500 text-white px-2 py-1 rounded"
          >
            Add Exercise
          </button>

          <button
            type="button"
            onClick={() => removeWorkout(index)}
            className="mt-4 bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove Workout
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          appendWorkout({ day: { value: "", label: "" }, exercises: [] })
        }
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Workout
      </button>

      <button type="submit" className="submit-button">
        Create Program
      </button>
    </form>
  );
}

export default CreateProgramForm;
