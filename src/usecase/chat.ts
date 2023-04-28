import type { AccountToken } from "@prisma/client";
import type { TokenMessage } from "firebase-admin/messaging";
import context, { IContext } from "../context";
import { BadRequestError } from "../error/client-error";
import FirebaseService from "../service/firebase";
import { randomUUID } from "crypto";

class ChatUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  async upsertToken(accountId: number, token: string): Promise<AccountToken> {
    const accountToken = await this.ctx.prisma.accountToken.upsert({
      where: {
        accountId_token: {
          accountId,
          token,
        },
      },
      update: {
        token,
      },
      create: {
        accountId,
        token,
      },
    });

    return accountToken;
  }

  async sendMessageDebug(
    accountId: number,
    message: string
  ) {
    const accountToken = await this.ctx.prisma.accountToken.findMany({
      where: {
        accountId,
      },
    });

    // wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const messagePayloads: TokenMessage[] = accountToken.map((token) => {
      return {
        token: token.token,
        notification: {
          title: "New Message",
          body: message,
        },
        data: {
          text: message,
        }
      };
    });

    const res = await Promise.all(messagePayloads.map(async (payload) => {
      return await FirebaseService.sendMessage(payload).catch(async (err) => {
        await this.ctx.prisma.accountToken.delete({
          where: {
            accountId_token: {
              accountId,
              token: payload.token,
            },
          },
        });
        return err.message;
      });
    }));
    return res;
  }

  async getChats(accountId: number) {
    const chats = await this.ctx.prisma.match.findMany({
      where: {
        OR: [
          {
            userId1: accountId,
          },
          {
            userId2: accountId,
          },
        ],
      },
      include: {
        user1: {
          include: {
            userPhoto: true,
          }
        },
        user2: {
          include: {
            userPhoto: true,
          }
        },
        messages: {
          orderBy: {
            timestamp: "desc",
          },
          take: 1,
        },
      },
    });

    const resChats = await Promise.all(chats.map(async (chat) => {
      const unreadCount = await this.ctx.prisma.message.count({
        where: {
          matchId: chat.id,
          timestamp: {
            gt: chat.userId1 === accountId ? chat.lastReadUser1 : chat.lastReadUser2,
          }
        },
      });
      return {
        ...chat,
        unreadCount,
      };
    }));

    // Sort chats by last message timestamp
    resChats.sort((a, b) => {
      const aTimestamp = a.messages[0]?.timestamp.getTime() || a.timestamp.getTime();
      const bTimestamp = b.messages[0]?.timestamp.getTime() || b.timestamp.getTime();
      return bTimestamp - aTimestamp;
    });

    // Swaps the user1 and user2 if the user is user2
    resChats.forEach((chat) => {
      if (chat.user2.id === accountId) {
        const temp = chat.user1;
        chat.user1 = chat.user2;
        chat.user2 = temp;
      }
    });

    return resChats;
  }

  async sendMessage(
    from: number,
    to: number,
    message: string
  ) {
    const timestamp = new Date();
    const match = await this.ctx.prisma.match.findFirst({
      where: {
        OR: [
          {
            userId1: from,
            userId2: to,
          },
          {
            userId1: to,
            userId2: from,
          },
        ],
      },
      include: {
        user1: true,
        user2: true,
      }
    });

    if (!match) {
      throw new BadRequestError("Match not found");
    }

    const accountToken = await this.ctx.prisma.accountToken.findMany({
      where: {
        accountId: to,
      },
    });

    const messageId = randomUUID();

    const messagePayloads: TokenMessage[] = accountToken.map((token) => {
      return {
        token: token.token,
        notification: {
          title: match.user1.id === from ? match.user2.name : match.user1.name,
          body: message,
        },
        data: {
          messageId,
          timestamp: timestamp.toISOString(),
          toId: to.toString(),
          fromId: from.toString(),
          text: message,
        }
      };
    });

    await Promise.all(messagePayloads.map(async (payload) => {
      return await FirebaseService.sendMessage(payload).catch(async (err) => {
        await this.ctx.prisma.accountToken.delete({
          where: {
            accountId_token: {
              accountId: to,
              token: payload.token,
            },
          },
        });
        console.log(err.message);
        return null;
      });
    }));

    const newMessage = await this.ctx.prisma.message.create({
      data: {
        id: messageId,
        matchId: match.id,
        senderId: from,
        content: message,
        timestamp,
      },
    });
    return newMessage;
  }

  async getMessages(accountId1: number, accountId2: number) {
    const match = await this.ctx.prisma.match.findFirst({
      where: {
        OR: [
          {
            userId1: accountId1,
            userId2: accountId2,
          },
          {
            userId1: accountId2,
            userId2: accountId1,
          },
        ],
      },
      include: {
        user1: true,
        user2: true,
      },
      orderBy: {
        timestamp: "desc",
      }
    });

    if (!match) {
      throw new BadRequestError("Match not found");
    }

    const messages = await this.ctx.prisma.message.findMany({
      where: {
        matchId: match.id,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    // Update last read
    if (match.userId1 === accountId1) {
      await this.ctx.prisma.match.update({
        where: {
          id: match.id,
        },
        data: {
          lastReadUser1: new Date(),
        },
      });
    } else {
      await this.ctx.prisma.match.update({
        where: {
          id: match.id,
        },
        data: {
          lastReadUser2: new Date(),
        },
      });
    }

    // Swaps the user1 and user2 if the user is user2
    if (match.user2.id === accountId1) {
      const temp = match.user1;
      match.user1 = match.user2;
      match.user2 = temp;
    }

    return {
      match,
      messages,
    };
  }

}

export default new ChatUseCase(context);
export { ChatUseCase };