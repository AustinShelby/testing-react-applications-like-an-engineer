"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  createNoteFormSchema,
  CreateNoteFormSchema,
} from "../utils/createNoteFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNote } from "../actions/createNote";

export const CreateNoteForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateNoteFormSchema>({
    resolver: zodResolver(createNoteFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const submit: SubmitHandler<CreateNoteFormSchema> = async (data) => {
    const response = await createNote(data);

    if (response?.error) {
      setError("content", {
        type: "manual",
        message: response.message,
      });
    } else {
      reset();
    }
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(submit)}>
        <div className="flex flex-col">
          <label
            htmlFor="note"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            Note
          </label>
          <input
            type="text"
            id="note"
            {...register("content")}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>
        <button
          // TODO: Remove the following line to introduce a bug to demonstrate how TDD can help with debugging
          // disabled={isSubmitting}
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          {isSubmitting ? "Creating..." : "Create Note"}
        </button>
      </form>
    </div>
  );
};
