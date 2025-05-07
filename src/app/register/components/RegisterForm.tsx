"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormSchema,
  registerFormSchema,
} from "../utils/registerFormSchema";
import { registerUser } from "../actions/registerUser";

export const RegisterForm = () => {
  const { register, handleSubmit } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submit: SubmitHandler<RegisterFormSchema> = async (data) => {
    await registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" {...register("username")} required />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" {...register("password")} required />
      <button type="submit">Register</button>
    </form>
  );
};
