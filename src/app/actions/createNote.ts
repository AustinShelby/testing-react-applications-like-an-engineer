"use server";

import { getAuthenticatedUser } from "@/auth";
import { redirect } from "next/navigation";
import { ApiReturn } from "@/app/utils/ApiReturnType";
import {
  createNoteFormSchema,
  CreateNoteFormSchema,
} from "../utils/createNoteFormSchema";
import { prisma } from "@/client";
import { revalidatePath } from "next/cache";

export const createNote = async (
  data: CreateNoteFormSchema
): Promise<ApiReturn> => {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/");
  }

  try {
    const valid = createNoteFormSchema.parse(data);

    await prisma.note.create({
      data: {
        content: valid.content,
        user: {
          connect: {
            id: user.userId,
          },
        },
      },
    });

    revalidatePath("/");
  } catch (error) {
    return {
      error: true,
      message: "Unknown error. Please try again.",
    };
  }
};
