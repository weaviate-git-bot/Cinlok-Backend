import { z } from "zod";

export const updateProfileSchema = z.object({
    username: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    dateOfBirth: z.string().transform(
        // Transform yyyy-mm-dd to Date
        (s) => new Date(s)
    ).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    sex: z.string().optional(),
    tags: z.array(z.string()).optional(),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

// Key format "photo_{i}" i is 0 to 3 (inclusive)
const photoKey = z.string().regex(/^photo_[0-3]$/)
export const updateProfilePhotoSchema = z.record(photoKey, z.any())

export type UpdateProfilePhotoSchema = z.infer<typeof updateProfilePhotoSchema>

export const deleteProfilePhotoSchema = z.object({
    index: z.array(z.number().min(0).max(3))
})

export type DeleteProfilePhotoSchema = z.infer<typeof deleteProfilePhotoSchema>

export const getProfileQuerySchema = z.object({
    userId: z.string().nonempty().transform((s) => parseInt(s))
})

export type GetProfileQuerySchema = z.infer<typeof getProfileQuerySchema>