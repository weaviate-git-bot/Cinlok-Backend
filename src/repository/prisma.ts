import { PrismaClient } from "@prisma/client";
import MixerService from "../service/mixer";

const ACTION_TO_CALLBACK = [
  "create",
  "update",
  "upsert",
];

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);
  
  if (params.model === "User" && ACTION_TO_CALLBACK.includes(params.action)  && result) {
    if (params.action === "create") {
      await MixerService.upsertUser(result as any, [], result.universitySlug);
    } else {
      const userId = params.args.where.id;
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        include: {
          userTag: {
            include: {
              tag: true
            }
          },
          userChannel: {
            include: {
              channel: true
            }
          }
        }
      });
      if (!user) {
        console.log(`User not found with id: ${params.args.data.id}`);
        return result;
      }
      await MixerService.upsertUser(user, user?.userTag.map((ut) => ut.tag.tag) || [], user?.universitySlug || "");
    }
  }

  return result;
});


export default prisma;
