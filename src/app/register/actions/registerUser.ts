"use server";

import { cookies } from "next/headers";
import {
  registerFormSchema,
  RegisterFormSchema,
} from "../utils/registerFormSchema";
import { createUserAndSession, setSessionTokenCookie } from "@/auth";
import { redirect } from "next/navigation";

export const registerUser = async (data: RegisterFormSchema) => {
  const valid = registerFormSchema.parse(data);

  const a = await createUserAndSession(valid.username, valid.password);

  const cookieStore = await cookies();

  await setSessionTokenCookie(cookieStore, a.sessionToken, a.sessionExpiresAt);

  redirect("/");
};
