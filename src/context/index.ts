import type { PrismaClient } from "@prisma/client";
import prisma from "../repository";

export interface IContext {
  prisma: PrismaClient;
  isMock: boolean;
};

const ctx = {
  prisma,
  isMock: false,
}

export const setCtx = (context: IContext) => {
  ctx.prisma = context.prisma;
  ctx.isMock = context.isMock;
}

export default ctx;