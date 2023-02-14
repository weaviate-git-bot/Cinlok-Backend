import type { PrismaClient } from "@prisma/client";
// import prisma from "../repository";
import context, { IContext } from "../context";

class UserUseCase {
  private prisma: PrismaClient;

  constructor(context: IContext) {
    this.prisma = context.prisma;
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

export default new UserUseCase(context);
export { UserUseCase };