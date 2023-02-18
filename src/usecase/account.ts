import type { Account } from "@prisma/client";
import context, { IContext } from "../context";
import bcrypt from "bcrypt";
import { LoginError, RegisterError } from "../error";

class AccountUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  async login(username: string, password: string): Promise<Account> {
    const account = await this.ctx.prisma.account.findUnique({
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

  async register(email: string, username: string, password: string): Promise<boolean> {
    
    // check valid email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // check unique email and username
    const account = await this.ctx.prisma.account.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });

    if (account) {
      throw new RegisterError();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await this.ctx.prisma.account.create({
      data: {
        email,
        username,
        password: hash,
        salt,
      },
    });

    return true;
  }
}

export default new AccountUseCase(context);
export { AccountUseCase };
