import { z } from "zod";

export const getUniversityQuerySchema = z.object({
  slug: z.string(),
});

export type GetUniversityQuerySchema = z.infer<typeof getUniversityQuerySchema>;

export const getAllUniversityQuerySchema = z.object({
  name: z.string().optional().default(""),
});

export type GetAllUniversityQuerySchema = z.infer<typeof getAllUniversityQuerySchema>;

export const createUniversitySchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
});

export type CreateUniversitySchema = z.infer<typeof createUniversitySchema>;

export const updateUniversityParamSchema = z.object({
  slug: z.string(),
});

export type UpdateUniversitySchema = z.infer<typeof updateUniversityParamSchema>;

export const updateUniversitySchema = z.object({
  name: z.string(),
});

export type UpdateUniversityParamSchema = z.infer<typeof updateUniversitySchema>;

export const updateUniversityLogoSchema = z.object({
  slug: z.string(),
  logo: z.any(),
});

export type UpdateUniversityLogoSchema = z.infer<typeof updateUniversityLogoSchema>;

export const deleteUniversityLogoSchema = z.object({
  slug: z.string(),
});

export type DeleteUniversityLogoSchema = z.infer<typeof deleteUniversityLogoSchema>;

export const deleteUniversitySchema = z.object({
  slug: z.string(),
});

export type DeleteUniversitySchema = z.infer<typeof deleteUniversitySchema>;