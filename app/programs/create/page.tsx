"use client";

//imports
import React, { useState } from "react";
import Header from "../../components/Header";
import { useForm, SubmitHandler } from "react-hook-form";
import { CreateProgramFormData } from "../program-types";
import ProgramFormField from "../ProgramFormField";

const CreateProgram: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProgramFormData>();

  const onSubmit: SubmitHandler<CreateProgramFormData> = (data) => {
    console.log("Program submitted: ", data);
  };
  //TODO: add actual submission logic here

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-2xl font-semibold mb-4">Create a new program</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
          <ProgramFormField
            type="text"
            label="Program Name"
            name="programName"
            register={register}
            error={errors.programName}
            required
            placeholder="Enter program name"
          />
          <ProgramFormField
            type="textarea"
            label="Description"
            name="description"
            register={register}
            error={errors.description}
            placeholder="Enter program description"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Create Program
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateProgram;
