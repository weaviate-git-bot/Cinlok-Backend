import type { Channel, UserChannel } from "@prisma/client";
import ctx from "../context";
import { BadRequestError } from "../error/client-error";
import AccountUseCase from "./account";

const ERR_CHANNEL_NOT_FOUND = "Channel not found";

interface ChannelMembers extends Channel {
    userChannel: {
        user: {
            id: number;
            name: string;
            userPhoto: {
                fileId: string;
                index: number;
            }[];
        };
    }[];
}

interface RequestChannel {
    name: string;
}

class ChannelUseCase {
  static async getAll(): Promise<Channel[]> {
    const channels = await ctx.prisma.channel.findMany();
    return channels;
  }

  static async getChannelMembers(channelId: number): Promise<ChannelMembers> {
    const members = await ctx.prisma.channel.findUnique({ where: { id: channelId }, include: {
      userChannel: {
        select: {
          user: {
            select: {
              name: true,
              id: true,
              userPhoto: {
                select: {
                  fileId: true,
                  index: true,
                },
              }
            }
          },
        }
      }
    } });
    if (!members) throw new BadRequestError(ERR_CHANNEL_NOT_FOUND);
    return members;
  }

  static async getUserChannels(userId: number) {
    const userChannels = await ctx.prisma.userChannel.findMany({
      where: { userId },
      select: {
        assignedAt: true,
        channel: true,
      },
    });
    return userChannels;
  }

  static async getChannel(id: number): Promise<Channel> {
    const channel = await ctx.prisma.channel.findUnique({ where: {id} });
    if (!channel) throw new BadRequestError(ERR_CHANNEL_NOT_FOUND);
    return channel;
  }

  static async searchChannel(name: string): Promise<Channel[]> {
    const channels = await ctx.prisma.channel.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
    return channels;
  }

  static async addChannel(channelReq: RequestChannel): Promise<Channel|null> {
    return await ctx.prisma.channel.create({
      data: channelReq,
    });
  }

  static async addUserToChannel(userId: number, channelId: number): Promise<UserChannel> {
    return await ctx.prisma.$transaction(async (tx) => {
      // 1. Check if user exists
      const checkUser = await AccountUseCase.getUserById(userId);
      if (!checkUser) throw new BadRequestError("User not found");
      // 2. Check if channel exists
      const checkChannel = await tx.channel.findUnique({ where: { id: channelId } });
      if (!checkChannel) throw new BadRequestError(ERR_CHANNEL_NOT_FOUND);
      // 3. Check if user already in channel
      const existingUserChannel = await tx.userChannel.findFirst({
        where: {
          channelId,
          userId,
        },
      });
      if (existingUserChannel) throw new BadRequestError("User already in channel");
      // Finally, create the user channel
      return await tx.userChannel.create({
        data: {
          channelId,
          userId,
        },
      });
    });
  }

  static async removeUserFromChannel(userId: number, channelId: number): Promise<UserChannel> {
    return await handleMissing(ctx.prisma.userChannel.delete({
      where: {
        userId_channelId: {
          channelId,
          userId,
        }
      },
    }));
  }

  static async removeUserFromAllChannel(userId: number) {
    return await ctx.prisma.userChannel.deleteMany({
      where: { userId },
    });
  }

  static async updateChannel(channelId: number, channelReq: RequestChannel): Promise<Channel> {
    return await handleMissing(ctx.prisma.channel.update({
      where: { id: channelId },
      data: channelReq,
    }));
  }

  static async deleteChannel(channelId: number): Promise<Channel> {
    return await ctx.prisma.$transaction(async (tx) => {
      // Make sure channel exist first
      const channel = await handleMissing(tx.channel.delete({ where: { id: channelId } }));
      await tx.userChannel.deleteMany({ where: { channelId } });
      return channel;
    });
  }
}

async function handleMissing(tx: Promise<any>) {
  return tx.catch((err) => { if (err.code === "P2025") throw new BadRequestError("Record not found"); else throw err; });
}

export { ChannelUseCase };