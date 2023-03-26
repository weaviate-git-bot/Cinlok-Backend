import type { Account } from "@prisma/client";
import context, { IContext } from "../context";
import bcrypt from "bcrypt";
import { LoginError, RegisterError } from "../error";
import jwt from "../lib/jwt";
import { ChannelUseCase } from "./channel";
import { BadRequestError } from "../error/client-error";

class AccountUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  async login(username: string, password: string): Promise<string> {
    const account = await this.ctx.prisma.account.findUnique({
      where: {
        username,
      },
    });

    if (account) {
      const hash = await bcrypt.hash(password, account.salt);
      if (hash === account.password) {
        const token = jwt.sign({
          id: account.id,
        })
        return token;
      }
    }

    throw new LoginError();
  }

  async isUniqueUsername(username: string): Promise<boolean> {
    const account = await this.ctx.prisma.account.findUnique({
      where: {
        username,
      },
    });

    return !account;
  }

  async isUniqueEmail(email: string): Promise<boolean> {
    const account = await this.ctx.prisma.account.findUnique({
      where: {
        email,
      },
    });

    return !account;
  }

  async register(email: string, username: string, password: string, univ_slug: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    if (!await this.isUniqueEmail(email) || !await this.isUniqueUsername(username)) {
      throw new RegisterError()
    }
    const university = await this.ctx.prisma.university.findUnique({
      where: {
        slug: univ_slug,
      },
    });
    if (!university) throw new BadRequestError("University not found");

    const res = await this.ctx.prisma.$transaction(async (tx) => {


      const account = await tx.account.create({
        data: {
          email,
          username,
          password: hash,
          salt,
        },
      });

      await tx.user.create({
        data: {
          id: account.id,
          name: "",
          description: "",
          dateOfBirth: new Date(),
          latitude: 0,
          longitude: 0,
          sex: "MALE",
          profileUrl: "",
          universitySlug: univ_slug,
        },
      });

      return {
        email: account.email,
        username: account.username,
        userId: account.id,
      };
    });

    await ChannelUseCase.addUserToChannel(res.userId, university.channelId);
    return res;
  }

  async updateAccount(id: number, data: any): Promise<Account> {
    const { username } = data;

    const newAccount = await this.ctx.prisma.account.update({
      where: {
        id,
      },
      data: {
        username,
      },
    });

    return newAccount;
  }

  async getUserById(id: number): Promise<Account | null> {
    const account = await this.ctx.prisma.account.findUnique({
      where: {
        id,
      },
    });

    return account;
  }

}

export default new AccountUseCase(context);
export { AccountUseCase };
