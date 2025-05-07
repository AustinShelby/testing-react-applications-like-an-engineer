import { z } from "zod";

export const registerFormSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(100),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
