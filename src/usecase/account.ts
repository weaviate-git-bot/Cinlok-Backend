import type { PrismaClient, Account } from "@prisma/client";
import context, { IContext } from "../context";
import bcrypt from "bcrypt";
import { LoginError } from "../error";

class AccountUseCase {
  private prisma: PrismaClient;

  constructor(context: IContext) {
    this.prisma = context.prisma;
  }

  async login(username: string, password: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: {
        username,
      },
    });

    if (account) {
      const hash = await bcrypt.hash(password, account.salt);
      if (hash === account.password) {
        return account;
      }
    }

    throw new LoginError();
  }
}

export default new AccountUseCase(context);
export { AccountUseCase };