"use server";

import { getAuthenticatedUser } from "@/auth";
import { prisma } from "@/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const toggleNotePrivacy = async ({
  noteId,
  isPrivate,
}: {
  noteId: number;
  isPrivate: boolean;
}) => {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const note = await prisma.note.update({
    where: {
      id: noteId,
      userId: user.userId,
    },
    data: {
      private: isPrivate,
    },
  });

  revalidatePath("/profile");
};
