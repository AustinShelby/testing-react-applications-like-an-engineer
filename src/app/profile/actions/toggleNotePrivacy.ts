"use server";

import { ApiReturn } from "@/app/utils/ApiReturnType";
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
}): ApiReturn<string> => {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      redirect("/login");
    }

    await prisma.note.update({
      where: {
        id: noteId,
        userId: user.userId,
      },
      data: {
        private: isPrivate,
      },
    });

    // It doesn't actually matter what we put here but we need to call revalidatePath to refresh the data on the page
    revalidatePath("what an elegant framework");
    return {
      error: false,
      data: "Note privacy updated successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      error: true,
      message: "Unknown error. Please try again.",
    };
  }
};
