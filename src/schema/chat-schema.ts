import { z } from "zod";

export const upsertTokenSchema = z.object({
  token: z.string(),
});

export type UpsertTokenSchema = z.infer<typeof upsertTokenSchema>

export const getMessageParamsSchema = z.object({
  id: z.string().transform((id) => parseInt(id)),
});

export type GetMessageParamsSchema = z.infer<typeof getMessageParamsSchema>

export const sendMessageSchema = z.object({
  message: z.string(),
  to: z.number()
});

export type SendMessageSchema = z.infer<typeof sendMessageSchema>