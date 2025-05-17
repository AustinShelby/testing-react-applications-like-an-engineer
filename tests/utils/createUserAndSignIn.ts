import { createUserAndSession } from "@/auth";
import { BrowserContext } from "@playwright/test";

export const createUserAndSignIn = async (
  username: string,
  password: string,
  context: BrowserContext
) => {
  const { sessionToken, sessionExpiresAt } = await createUserAndSession(
    username,
    password
  );

  await context.addCookies([
    {
      name: "session",
      value: sessionToken,
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      expires: Math.round(sessionExpiresAt.getTime() / 1000),
      path: "/",
      domain: "localhost",
    },
  ]);
};
