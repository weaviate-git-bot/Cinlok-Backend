import { z } from "zod";

export const updateProfileSchema = z.object({
    username: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    dateOfBirth: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    sex: z.string().optional(),
    tags: z.array(z.string()).optional(),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

export const updateProfilePhotoSchema = z.object({
    photoUrl: z.string().optional(),
    userPhoto: z.array(z.string()).optional(),
})

export type UpdateProfilePhotoSchema = z.infer<typeof updateProfilePhotoSchema>
