import { getAuthenticatedUser } from "@/auth";
import { prisma } from "@/client";
import { redirect } from "next/navigation";
import { CreateNoteForm } from "../components/CreateNoteForm";
import { NotePrivacyToggleButton } from "./components/NotePrivacyToggleButton";
import Link from "next/link";
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
      <div className="mt-16">
        <h1 className="text-2xl mb-8">Create your first note</h1>
        <CreateNoteForm />
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h1 className="text-2xl mb-8">Your Notes</h1>
      <CreateNoteForm />
      <ul className="mt-8 divide-y divide-gray-200">
        {notes.map((note) => (
          <li key={note.id} className="py-3">
            <Note
              noteId={note.id}
              content={note.content}
              userId={user.userId}
              username={user.username}
              isPrivate={note.private}
              isCurrentUsers={user.userId === note.userId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
