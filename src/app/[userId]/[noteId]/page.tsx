import { Note } from "@/app/components/Note";
import { getAuthenticatedUser } from "@/auth";
import { prisma } from "@/client";
import { notFound } from "next/navigation";
import { z } from "zod";

const stringNumberSchema = z.coerce.number();

const parseNumberString = (userId: string): number | undefined => {
  try {
    const valid = stringNumberSchema.parse(userId);
    return valid;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const NotePage = async ({
  params,
}: {
  params: Promise<{ userId: string; noteId: string }>;
}) => {
  const { userId, noteId } = await params;

  const parsedUserId = parseNumberString(userId);
  const parsedNoteId = parseNumberString(noteId);

  if (parsedUserId === undefined || parsedNoteId === undefined) {
    notFound();
  }

  const currentUser = await getAuthenticatedUser();

  const note = await prisma.note.findUnique({
    where: {
      id: parsedNoteId,
      userId: parsedUserId,
      // TODO: Make a bug report that says that a note is not found on this address. Demonstrate that the spec is wrong (unambigious) as it doesn't specify that the note needs to be public for it to be found on this address.

      // private: false,
      OR: [
        {
          private: false,
        },
        ...(currentUser
          ? [
              {
                userId: currentUser.userId,
              },
            ]
          : []),
      ],
    },
    select: {
      id: true,
      content: true,
      private: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!note) {
    notFound();
  }

  return (
    <div className="p-6">
      <Note
        noteId={note.id}
        content={note.content}
        userId={note.user.id}
        username={note.user.username}
        isPrivate={note.private}
        isCurrentUsers={currentUser?.userId === note.user.id}
        createdAt={note.createdAt}
      />
    </div>
  );
};

export const metadata = {
  title: "User",
  description: "User page",
};

export default NotePage;
