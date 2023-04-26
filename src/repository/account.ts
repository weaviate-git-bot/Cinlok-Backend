import type { Account, PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import type { ModelOptionalId, AllOptional } from ".";

export interface IAccountRepository {
    create(data: ModelOptionalId<Account>): Promise<Account>;
    findByUsername(username: string): Promise<Account | null>;
    findByEmail(email: string): Promise<Account | null>;
    update(id: number, data: AllOptional<Account>): Promise<Account>;
    findById(id: number): Promise<Account | null>;
}

export class AccountRepository implements IAccountRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  create(data: ModelOptionalId<Account>) {
    return this.prisma.account.create({
      data,
    });
  }
  findByUsername(username: string) {
    return this.prisma.account.findFirst({
      where: {
        username,
      },
    });
  }
  findByEmail(email: string) {
    return this.prisma.account.findFirst({
      where: {
        email,
      },
    });
  }
  update(id: number, data: AllOptional<Account>) {
    return this.prisma.account.update({
      where: {
        id,
      },
      data,
    });
  }
  findById(id: number) {
    return this.prisma.account.findUnique({
      where: {
        id,
      },
    });
  }
}

export const accountRepository = new AccountRepository(prisma);
