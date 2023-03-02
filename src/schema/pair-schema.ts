import { z } from "zod";

export const acceptPairSchema = z.object({
  pairedId: z.number(),
})

export type AcceptPairSchema = z.infer<typeof acceptPairSchema>

