import type { PrismaClient } from "@prisma/client";
import prisma from "../repository";
import CacheService from "../service/cache";
import DriveService from "../service/drive";
import MixerService from "../service/mixer";

export interface IContext {
  prisma: PrismaClient;
  drive: typeof DriveService;
  mixer: typeof MixerService;
  cache: typeof CacheService;
  isMock: boolean;
}

const ctx = {
  prisma,
  drive: DriveService,
  mixer: MixerService,
  cache: CacheService,
  isMock: false,
};

export const setCtx = (context: IContext) => {
  ctx.prisma = context.prisma;
  ctx.isMock = context.isMock;
  ctx.mixer = context.mixer;
  ctx.drive = context.drive;
};

export default ctx;