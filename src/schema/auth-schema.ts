import { z } from "zod";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  univ_slug: z.string(),
})

export type RegisterSchema = z.infer<typeof registerSchema>