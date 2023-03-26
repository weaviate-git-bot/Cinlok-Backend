import { z } from "zod";

export const acceptPairSchema = z.object({
  pairedId: z.number(),
})

export type AcceptPairSchema = z.infer<typeof acceptPairSchema>

export const getPairQuerySchema = z.object({
  n: z.coerce.number().optional(),
})

export type GetPairQuerySchema = z.infer<typeof getPairQuerySchema>