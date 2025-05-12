import { getAuthenticatedUser } from "@/auth";
import { prisma } from "@/client";
import { CreateNoteForm } from "./components/CreateNoteForm";
import Link from "next/link";
import { Note } from "./components/Note";

const HomePage = async () => {
  const user = await getAuthenticatedUser();

  const notes = await prisma.note.findMany({
    where: {
      private: false,
    },
    orderBy: {
      // TODO: Sort by id instead to demonstrate that in test when seeding data we want to purspofully insert data in a strange order to catch these kinds of errors
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  return (
    <div className="w-full">
      {user && <CreateNoteForm />}
      <ul className="mt-18 divide-y divide-gray-200">
        {notes.map((note) => (
          <li key={note.id} className="py-3">
            <Note
              noteId={note.id}
              content={note.content}
              userId={note.userId}
              username={note.user.username}
              isPrivate={note.private}
              isCurrentUsers={user?.userId === note.userId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
export const metadata = {
  title: "Home",
  description: "Home page",
};
