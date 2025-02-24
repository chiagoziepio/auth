import { z } from "zod";

export const loginSchemaZod = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchemaZod = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});
