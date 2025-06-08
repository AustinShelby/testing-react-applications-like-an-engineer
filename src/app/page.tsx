import { getAuthenticatedUser } from "@/auth";
import { prisma } from "@/client";
import { CreateNoteForm } from "./components/CreateNoteForm";
import { Note } from "./components/Note";

const HomePage = async () => {
  const user = await getAuthenticatedUser();

  const notes = await prisma.note.findMany({
    where: {
      private: false,
    },
    orderBy: {
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
      {user && (
        <div className="border-b border-gray-200 p-6">
          <CreateNoteForm />
        </div>
      )}
      <ul className="divide-y divide-gray-200">
        {notes.map((note) => (
          <li key={note.id} className="p-6">
            <Note
              noteId={note.id}
              content={note.content}
              userId={note.userId}
              username={note.user.username}
              isPrivate={note.private}
              isCurrentUsers={user?.userId === note.userId}
              createdAt={note.createdAt}
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
