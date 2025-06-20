"use server";

import { cookies } from "next/headers";
import {
  registerFormSchema,
  RegisterFormSchema,
} from "../utils/registerFormSchema";
import {
  createUserAndSession,
  getAuthenticatedUser,
  setSessionTokenCookie,
  UsernameTakenError,
} from "@/auth";
import { redirect } from "next/navigation";
import { ApiReturn } from "@/app/utils/ApiReturnType";

type RegisterError = "USERNAME_TAKEN" | "UNKNOWN_ERROR";

export const registerUser = async (
  data: RegisterFormSchema
): Promise<ApiReturn<any, RegisterError>> => {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect("/");
  }

  try {
    const valid = registerFormSchema.parse(data);

    const userAndSession = await createUserAndSession(
      valid.username,
      valid.password
    );

    const cookieStore = await cookies();

    await setSessionTokenCookie(
      cookieStore,
      userAndSession.sessionToken,
      userAndSession.sessionExpiresAt
    );
  } catch (error) {
    if (error instanceof UsernameTakenError) {
      return {
        error: true,
        message: "USERNAME_TAKEN",
      };
    } else {
      return {
        error: true,
        message: "UNKNOWN_ERROR",
      };
    }
  }

  redirect("/");
};
