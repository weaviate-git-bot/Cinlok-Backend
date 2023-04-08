import { z } from "zod";

export const addTagSchema = z.object({
  tag: z.string(),
});

export type AddTagSchema = z.infer<typeof addTagSchema>