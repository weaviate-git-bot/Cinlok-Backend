import type { PrismaClient } from "@prisma/client";
import prisma from "../repository";
import DriveService from "../service/drive";

export interface IContext {
  prisma: PrismaClient;
  drive: typeof DriveService
  isMock: boolean;
};

const ctx = {
  prisma,
  drive: DriveService,
  isMock: false,
}

export const setCtx = (context: IContext) => {
  ctx.prisma = context.prisma;
  ctx.isMock = context.isMock;
  ctx.drive = context.drive;
}

export default ctx;