import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().min(1, "Username or email required"),
  password: z.string().min(1, "Password required"),
});

export const loginSchema = { body: loginBodySchema };
