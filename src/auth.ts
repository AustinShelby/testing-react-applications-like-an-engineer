import { hash, verify } from "@node-rs/argon2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { Session } from "./generated/prisma";
import { prisma } from "@/client";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Prisma } from "@/generated/prisma";

export class UsernameTakenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsernameTakenError";
  }

  get [Symbol.toStringTag]() {
    return this.name;
  }
}

export const createUserAndSession = async (
  username: string,
  password: string
): Promise<{
  user: {
    id: number;
    username: string;
    passwordHash: string;
  };
  sessionToken: string;
  sessionExpiresAt: Date;
}> => {
  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: { username, passwordHash: hashedPassword },
    });
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);

    return {
      user: user,
      sessionToken: sessionToken,
      sessionExpiresAt: session.expiresAt,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new UsernameTakenError(
        `A user with the username "${username}" already exists.`
      );
    } else {
      throw error;
    }
  }
};

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFoundError";
  }

  get [Symbol.toStringTag]() {
    return this.name;
  }
}

export class IncorrectPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IncorrectPasswordError";
  }

  get [Symbol.toStringTag]() {
    return this.name;
  }
}

export const authenticateUser = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new UserNotFoundError(
      `A user with the username "${username}" does not exist.`
    );
  }

  const verified = await verifyPasswordHash(user.passwordHash, password);

  if (!verified) {
    throw new IncorrectPasswordError("Incorrect password.");
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);

  return {
    user: user,
    sessionToken: sessionToken,
    sessionExpiresAt: session.expiresAt,
  };
};

export const setSessionTokenCookie = (
  cookieStore: ReadonlyRequestCookies,
  token: string,
  expiresAt: Date
): void => {
  cookieStore.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
};

export const deleteSessionTokenCookie = (
  cookieStore: ReadonlyRequestCookies
): void => {
  cookieStore.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
};

const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
};

export async function verifyPasswordHash(
  hash: string,
  password: string
): Promise<boolean> {
  return await verify(hash, password);
}

export const generateSessionToken = (): string => {
  const tokenBytes = new Uint8Array(20);

  crypto.getRandomValues(tokenBytes);

  const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();

  return token;
};

export const createSession = async (
  token: string,
  userId: number
): Promise<Session> => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  return session;
};

export const validateSessionToken = async (token: string): Promise<any> => {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (result === null) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;

  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });

    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }

  return { session, user };
};

export const invalidateSession = async (sessionId: string): Promise<void> => {
  await prisma.session.delete({ where: { id: sessionId } });
};

export const getAuthenticatedUser = async (): Promise<
  { username: string; userId: number; sessionId: string } | undefined
> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token === undefined) {
    return undefined;
  }

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    select: {
      expiresAt: true,
      id: true,
      user: { select: { id: true, username: true } },
    },
  });

  if (!session) {
    return undefined;
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return undefined;
  }

  // 15 days
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        expiresAt: newExpiresAt,
      },
    });
  }

  return {
    username: session.user.username,
    userId: session.user.id,
    sessionId: session.id,
  };
};
