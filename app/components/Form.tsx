import { useForm } from "react-hook-form";
import FormField from "./FormField";
import { FormData, UserSchema, ValidFieldNames } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const muscleGroups = [
  { key: 1, value: "Calves" },
  { key: 2, value: "Quads" },
  { key: 3, value: "Hamstrings" },
  { key: 4, value: "Glutes" },
  { key: 5, value: "Hip flexors" },
  { key: 6, value: "Abdominals" },
  { key: 7, value: "Obliques" },
  { key: 8, value: "Lower back" },
  { key: 9, value: "Lats" },
  { key: 10, value: "Traps" },
  { key: 11, value: "Chest" },
  { key: 12, value: "Rear delts" },
  { key: 13, value: "Lateral delts" },
  { key: 14, value: "Front delts" },
  { key: 15, value: "Biceps" },
  { key: 16, value: "Triceps" },
  { key: 17, value: "Forearms" },
  { key: 18, value: "Cardiovascular system" },
];

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema), // Apply the zodResolver
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("/api/form", data); // Make a POST request
      const { errors = {} } = response.data; // Destructure the 'errors' property from the response data

      // Define a mapping between server-side field names and their corresponding client-side names
      const fieldErrorMapping: Record<string, ValidFieldNames> = {
        exerciseName: "exerciseName",
        exerciseDescription: "exerciseDescription",
        isTimeBased: "isTimeBased",
        primaryMuscleGroupId: "primaryMuscleGroupId",
        secondaryMuscleGroupId: "secondaryMuscleGroupId",
      };

      // Find the first field with an error in the response data
      const fieldWithError = Object.keys(fieldErrorMapping).find(
        (field) => errors[field]
      );

      // If a field with an error is found, update the form error state using setError
      if (fieldWithError) {
        // Use the ValidFieldNames type to ensure the correct field names
        setError(fieldErrorMapping[fieldWithError], {
          type: "server",
          message: errors[fieldWithError],
        });
      }
    } catch (error) {
      alert("Submitting form failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid col-auto">
        <h1 className="text-3xl font-bold mb-4">Create Exercise</h1>
        <FormField
          type="text"
          placeholder="exercise name"
          name="exerciseName"
          register={register}
          error={errors.exerciseName}
        />

        <FormField
          type="textarea"
          placeholder="description (optional)"
          name="exerciseDescription"
          register={register}
          error={errors.exerciseDescription}
        />

        <FormField
          type="boolean"
          label="Is this a time based exercise?"
          name="isTimeBased"
          register={register}
          error={errors.isTimeBased}
          valueAsNumber
        />

        <FormField
          type="select"
          name="primaryMuscleGroupId"
          label="Primary Muscle Group"
          register={register}
          error={errors.primaryMuscleGroupId}
          required
          valueAsNumber
        >
          <option value="">Select a muscle group</option>
          {muscleGroups.map(({ key, value }) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </FormField>

        <FormField
          type="select"
          name="secondaryMuscleGroupId"
          label="Secondary Muscle Group"
          register={register}
          error={errors.secondaryMuscleGroupId}
          valueAsNumber
        >
          <option value="">Select a muscle group</option>
          {muscleGroups.map(({ key, value }) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </FormField>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </div>
    </form>
  );
}

export default Form;
