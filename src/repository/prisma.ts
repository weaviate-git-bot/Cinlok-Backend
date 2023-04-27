import { PrismaClient } from "@prisma/client";
import MixerService from "../service/mixer";

const ACTION_TO_CALLBACK = [
  "create",
  "createMany",
  "update",
  "updateMany",
  "upsert",
];

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);
  
  if (params.model === "User" && ACTION_TO_CALLBACK.includes(params.action) && result) {
    const users = await prisma.user.findMany({
      include: {
        userTag: {
          include: {
            tag: true,
          }
        },
        userChannel: {
          include: {
            channel: true,
          }
        }
      }
    });

    const mixerUser = users.map((user) => {
      if (!user.userChannel[0]) {
        return null;
      }
      return {
        id: `${user.id}`,
        words: user.userTag.map((userTag) => userTag.tag.tag),
        channel: user.userChannel[0].channel.name,
      };
    }).reduce((acc, cur) => {
      if (cur) {
        acc.push(cur);
      }
      return acc;
    }, [] as any[]);

    await MixerService.clearChannel();
    await MixerService.upsertBatch(mixerUser);
  }

  return result;
});


export default prisma;
