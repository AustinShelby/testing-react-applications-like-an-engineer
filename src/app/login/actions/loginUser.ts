"use server";

import { cookies } from "next/headers";
import {
  authenticateUser,
  getAuthenticatedUser,
  IncorrectPasswordError,
  setSessionTokenCookie,
  UserNotFoundError,
} from "@/auth";
import { redirect } from "next/navigation";
import { ApiReturn } from "@/app/utils/ApiReturnType";
import {
  registerFormSchema,
  RegisterFormSchema,
} from "@/app/register/utils/registerFormSchema";

type RegisterError = "USER_NOT_FOUND" | "INVALID_PASSWORD" | "UNKNOWN_ERROR";

export const loginUser = async (
  data: RegisterFormSchema
): Promise<ApiReturn<any, RegisterError>> => {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect("/");
  }

  try {
    const valid = registerFormSchema.parse(data);

    const userAndSession = await authenticateUser(
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
    if (error instanceof UserNotFoundError) {
      return {
        error: true,
        message: "USER_NOT_FOUND",
      };
    } else if (error instanceof IncorrectPasswordError) {
      return {
        error: true,
        message: "INVALID_PASSWORD",
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
