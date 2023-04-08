import { z } from "zod";

export const nameChannelSchema = z.object({
  name: z.string(),
});
export type NameChannelSchema = z.infer<typeof nameChannelSchema>;

export const idChannelSchema = z.object({
  id: z.coerce.number(),
});
export type IdChannelSchema = z.infer<typeof idChannelSchema>;

export const updateChannelSchema = z.object({
  name: z.string(),
});
export type UpdateChannelSchema = z.infer<typeof updateChannelSchema>;

export const addChannelSchema = z.object({
  name: z.string(),
});
export type AddChannelSchema = z.infer<typeof addChannelSchema>;

export const channelMemberSchema = z.object({
  id: z.coerce.number(),
  userId: z.coerce.number().optional(),
});
export type ChannelMemberSchema = z.infer<typeof channelMemberSchema>;
