"use server";

import {
  deleteSessionTokenCookie,
  invalidateSession,
  getAuthenticatedUser,
} from "@/auth";
import { cookies } from "next/headers";

export const logout = async () => {
  // TODO: We want session, not account. Make API more clear
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  await invalidateSession(user.sessionId);

  const cookieStore = await cookies();

  await deleteSessionTokenCookie(cookieStore);
};
