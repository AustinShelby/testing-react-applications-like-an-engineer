"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormSchema,
  registerFormSchema,
} from "@/app/register/utils/registerFormSchema";
import { loginUser } from "../actions/loginUser";
import Link from "next/link";

export const LoginForm = () => {
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
    const response = await loginUser(data);

    if (response?.error) {
      if (response.message === "USER_NOT_FOUND") {
        setError("username", {
          type: "manual",
          message: "User not found. Please check your username.",
        });
      } else if (response.message === "INVALID_PASSWORD") {
        setError("password", {
          type: "manual",
          message: "Invalid password. Please try again.",
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
    <div className="flex flex-col gap-4 p-6 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit(submit)}>
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

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
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="flex flex-col mt-4">
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
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className="px-4 py-2 text-white bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full mt-8"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};
