"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormSchema,
  registerFormSchema,
} from "../utils/registerFormSchema";
import { registerUser } from "../actions/registerUser";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submit: SubmitHandler<RegisterFormSchema> = async (data) => {
    const response = await registerUser(data);

    if (response.error) {
      if (response.message === "USERNAME_TAKEN") {
        setError("username", {
          type: "manual",
          message: "Username is already taken",
        });
      } else if (response.message === "UNKNOWN_ERROR") {
        setError("username", {
          type: "manual",
          message: "An unknown error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-4 p-6 bg-white shadow-md rounded-md"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

      <div className="flex flex-col">
        <label
          htmlFor="username"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          {...register("username")}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="password"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register("password")}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Register
      </button>
    </form>
  );
};
