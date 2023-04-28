import { IMockContext, createMockContext } from "../../context";
import type { IContext } from "../../../../src/context";
import { AccountUseCase } from "../../../../src/usecase/account";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { LoginError } from "../../../../src/error";
import jwt from "../../../../src/lib/jwt";

let mockCtx: IMockContext;
let ctx: IContext;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as IContext;
});

test("should login successfully", async () => {
  const loginReq = {
    username: "malik",
    password: "password",
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(loginReq.password, salt);

  const account = {
    id: 1,
    email: "malik@gmail.com",
    username: "malik",
    password: hashedPassword,
    role: Role.USER,
    salt,
  };

  mockCtx.prisma.account.findUnique.mockResolvedValue(account);

  const accountUseCase = new AccountUseCase(ctx);

  const token = jwt.sign({
    id: account.id,
  })

  await expect(
    accountUseCase.login(loginReq.username, loginReq.password)
  ).resolves.toEqual(token);
});

test("should throw error when password is incorrect failed", async () => {
  const loginReq = {
    username: "malik",
    password: "password",
  };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(loginReq.password, salt);

  const account = {
    id: 1,
    email: "malik@gmail.com",
    username: "malik",
    password: hashedPassword + "1", // wrong password
    role: Role.USER,
    salt,
  };

  mockCtx.prisma.account.findUnique.mockResolvedValue(account);

  const accountUseCase = new AccountUseCase(ctx);

  await expect(
    accountUseCase.login(loginReq.username, loginReq.password)
  ).rejects.toThrow(LoginError);
});

test("should throw error when account is not found", async () => {
  const loginReq = {
    username: "malik",
    password: "password",
  };

  mockCtx.prisma.account.findUnique.mockResolvedValue(null);

  const accountUseCase = new AccountUseCase(ctx);

  await expect(
    accountUseCase.login(loginReq.username, loginReq.password)
  ).rejects.toThrow(LoginError);
});
