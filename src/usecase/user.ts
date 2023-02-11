import type { PrismaClient, Prisma } from "@prisma/client";
import prisma from "../repository";



class UserUseCase {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    return this.prisma.user.findMany({
      include: {
        userPhoto: true,
        userTag: true,
        account: true,
        pair: true,
        match: true,
      }
    });
  }
}

export default new UserUseCase(prisma);