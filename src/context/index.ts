import type { PrismaClient } from "@prisma/client";
import prisma from "../repository";

export interface IContext {
  prisma: PrismaClient;
};

export default {
  prisma,
}
