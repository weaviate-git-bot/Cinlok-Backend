import { IMockContext, createMockContext } from "../../context";
import { IContext, setCtx } from "../../../src/context";
import { PairUseCase } from "../../../src/usecase/pair";
import { GDate } from "../../../src/utils";

let mockCtx: IMockContext;
let ctx: IContext;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as IContext;
});

test("should create pair successfully", async () => {
  const curDate = new Date();

  GDate.instance.setDate(curDate);

  setCtx(ctx);

  const accReq = {
    id: 1,
    userId: 1,
    pairedId: 2,
  };

  const pair = {
    id: accReq.id,
    userId: accReq.userId,
    pairedId: accReq.pairedId,
    timestamp: curDate,
    hasMatched: false,
  };

  mockCtx.prisma.pair.create.mockResolvedValue(pair);

  const pairUseCase = new PairUseCase(ctx);

  await expect(
    pairUseCase.accept(accReq.userId, accReq.pairedId)
  ).resolves.toEqual({
    pair,
    match: null,
  });
});

test("should create match and update pair successfully", async () => {
  const curDate = new Date();

  GDate.instance.setDate(curDate);

  setCtx(ctx);

  const accReq = {
    userId: 1,
    pairedId: 2,
  };

  const createdPair = {
    id: 1,
    userId: accReq.userId,
    pairedId: accReq.pairedId,
    timestamp: curDate,
    hasMatched: false,
  };

  mockCtx.prisma.pair.create.mockResolvedValue(createdPair);

  const pair = {
    id: 2,
    userId: accReq.pairedId,
    pairedId: accReq.userId,
    timestamp: curDate,
    hasMatched: false,
  };
  mockCtx.prisma.pair.findFirst.mockResolvedValue(pair);

  const updatedCurPair = {
    id: createdPair.id,
    userId: accReq.userId,
    pairedId: accReq.pairedId,
    timestamp: curDate,
    hasMatched: true,
  };

  const updatedPairedPair = {
    ...pair,
    hasMatched: true,
  };
  mockCtx.prisma.pair.update.mockResolvedValue(updatedPairedPair);
  mockCtx.prisma.pair.update.mockResolvedValue(updatedCurPair);

  const match = {
    id: 3,
    userId1: accReq.userId,
    userId2: accReq.pairedId,
    timestamp: curDate,
  };
  mockCtx.prisma.match.create.mockResolvedValue(match);

  const transactionRes = [match, updatedPairedPair, updatedCurPair] as const;
  mockCtx.prisma.$transaction.mockResolvedValue(transactionRes);

  const pairUseCase = new PairUseCase(ctx);
  await expect(
    pairUseCase.accept(accReq.userId, accReq.pairedId)
  ).resolves.toEqual({
    pair: updatedCurPair,
    match,
  });
})
