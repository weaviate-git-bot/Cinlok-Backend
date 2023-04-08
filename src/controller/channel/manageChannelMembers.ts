import type { Request, Response } from "express";
import { AsyncRoute } from "../../middleware/async-wrapper";
import { channelMemberSchema, idChannelSchema } from "../../schema/channel-schema";
import { ChannelUseCase } from "../../usecase/channel";

export const getChannelMembers = AsyncRoute(async (req: Request, res: Response) => {
  const { id } = idChannelSchema.parse(req.params);
  const members = await ChannelUseCase.getChannelMembers(id);
  res.send({
    message: "Get channel members success",
    channel: { id: members.id, name: members.name },
    members: members.userChannel.map((uc) => uc.user),
  });
});

export const getUserChannels = AsyncRoute(async (_: Request, res: Response) => {
  const data = await ChannelUseCase.getUserChannels(res.locals.account.id);

  res.send({
    message: "Get user channels success",
    channels: data.map((d) => ({
      assignedAt: d.assignedAt,
      ...d.channel
    })),
  });
});

export const addChannelMember = AsyncRoute(async (req: Request, res: Response) => {
  const { id, userId } = channelMemberSchema.parse(req.params);
  const channel = await ChannelUseCase.addUserToChannel(userId === undefined ? res.locals.account.id : userId, id);

  res.send({
    message: "Add channel member success",
    channel,
  });
});

export const deleteChannelMember = AsyncRoute(async (req: Request, res: Response) => {
  const { id, userId } = channelMemberSchema.parse(req.params);
  const channel = await ChannelUseCase.removeUserFromChannel(userId === undefined ? res.locals.account.id : userId, id);

  res.send({
    message: "Remove channel member success",
    channel,
  });
});
