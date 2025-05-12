import { z } from "zod";

export const createNoteFormSchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be less than 500 characters"),
});

export type CreateNoteFormSchema = z.infer<typeof createNoteFormSchema>;
