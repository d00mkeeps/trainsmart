// ExerciseSelectField.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  Control,
  FieldValues,
  Path,
  Controller,
} from "react-hook-form";
import Select, { components, OptionProps } from "react-select";
import ActionButton from "./ActionButton";
import { RetrievedExercise } from "@/types";
import fetchUserProfiles, {
  supabase,
  fetchUserExercises,
} from "../supabaseFunctions";

interface ExerciseOption {
  value: number;
  label: string;
  isTemplate: boolean;
  description?: string | null;
}

interface ExerciseSelectFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder: string;
  onExerciseSelect?: (value: number | null) => void;
}

const ExerciseSelectField = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  onExerciseSelect,
}: ExerciseSelectFieldProps<TFieldValues>) => {
  const [exercises, setExercises] = useState<ExerciseOption[]>([]);
  const router = useRouter();

  const loadExercises = async () => {
    const userProfile = await fetchUserProfiles();
    if (userProfile) {
      const userExercises = await fetchUserExercises(userProfile.user_id);
      if (userExercises) {
        setExercises(
          userExercises.map((ex) => ({
            value: ex.id,
            label: ex.name,
            isTemplate: ex.is_template,
            description: ex.description,
          }))
        );
      }
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const handleDelete = async (exerciseId: number) => {
    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", exerciseId);

    if (error) {
      console.error("Error deleting exercise:", error);
      // Add user feedback for error
    } else {
      // Refresh the exercise list after successful deletion
      loadExercises();
      // Add user feedback for successful deletion
    }
  };

  const CustomOption: React.FC<OptionProps<ExerciseOption, false>> = (
    props
  ): React.ReactElement => {
    const { label, description, isTemplate, value } = props.data;

    const handleEdit = (exerciseId: number) => {
      router.push(`/exercises/edit/${exerciseId}`);
    };

    const handleModify = (exerciseId: number) => {
      router.push(`/exercises/create-from-template/${exerciseId}`);
    };

    return (
      <components.Option {...props}>
        <div className="flex items-center justify-between">
          <span>
            {label}
            {isTemplate ? (
              <span className="ml-2">(template)</span>
            ) : (
              <span className="ml-2">
                | {description ? description : <i>No Description</i>}
              </span>
            )}
          </span>
          <div>
            {isTemplate ? (
              <ActionButton
                href="#"
                label="Modify"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModify(value);
                }}
              />
            ) : (
              <>
                <ActionButton
                  href="#"
                  label="Edit"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(value);
                  }}
                />
                <ActionButton
                  href="#"
                  label="Delete"
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(value);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </components.Option>
    );
  };

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select<ExerciseOption, false>
            {...field}
            options={exercises}
            placeholder={placeholder}
            onChange={(selectedOption) => {
              field.onChange(selectedOption ? selectedOption.value : null);
              if (onExerciseSelect) {
                onExerciseSelect(selectedOption ? selectedOption.value : null);
              }
            }}
            components={{
              Option: CustomOption,
            }}
            isSearchable={true}
          />
        )}
      />
    </div>
  );
};

export default ExerciseSelectField;
