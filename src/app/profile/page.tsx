import { getAuthenticatedUser } from "@/auth";
import { prisma } from "@/client";
import { redirect } from "next/navigation";
import { CreateNoteForm } from "../components/CreateNoteForm";
import { Note } from "../components/Note";

const ProfilePage = async () => {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const notes = await prisma.note.findMany({
    where: {
      userId: user.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (notes.length === 0) {
    return (
      <div className="">
        <h1 className="text-2xl mt-6 mx-6">Create your first note</h1>
        <div className="p-6">
          <CreateNoteForm />
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-2xl mt-6 mx-6">Your Notes</h1>
      <div className="border-b border-gray-200 p-6">
        <CreateNoteForm />
      </div>
      <ul className="divide-y divide-gray-200">
        {notes.map((note) => (
          <li key={note.id} className="p-6">
            <Note
              noteId={note.id}
              content={note.content}
              userId={user.userId}
              username={user.username}
              isPrivate={note.private}
              isCurrentUsers={user.userId === note.userId}
              createdAt={note.createdAt}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
