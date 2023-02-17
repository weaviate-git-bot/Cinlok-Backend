import { z } from "zod";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email : z.string(),
  username : z.string(),
  password : z.string(),
  confirmPassword : z.string()
})

export type RegisterSchema = z.infer<typeof registerSchema>