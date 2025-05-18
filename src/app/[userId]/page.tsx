import { prisma } from "@/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { Note } from "../components/Note";
import { getActiveResourcesInfo } from "process";
import { getAuthenticatedUser } from "@/auth";

const userIdSchema = z.coerce.number();

const parseUserId = (userId: string): number | undefined => {
  try {
    const valid = userIdSchema.parse(userId);
    return valid;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const UserPage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;

  const parsedUserId = parseUserId(userId);

  if (parsedUserId === undefined) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parsedUserId,
    },
    select: {
      id: true,
      username: true,
      notes: {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          private: false,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const currentUser = await getAuthenticatedUser();

  return (
    <div className="w-full">
      <h1 className="text-2xl p-6 border-b border-gray-200">{user.username}</h1>
      <ul className="divide-y divide-gray-200">
        {user.notes.map((note) => (
          <li key={note.id} className="p-6">
            <Note
              noteId={note.id}
              content={note.content}
              userId={user.id}
              isPrivate={note.private}
              isCurrentUsers={note.userId === currentUser?.userId}
              username={user.username}
              createdAt={note.createdAt}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const metadata = {
  title: "User",
  description: "User page",
};

export default UserPage;
