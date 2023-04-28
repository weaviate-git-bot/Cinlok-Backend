import { IMockContext, createMockContext } from "../../context";
import type { IContext } from "../../../src/context";
import { MatchUseCase } from "../../../src/usecase/match";
import { GDate } from "../../../src/utils";
import type { Match } from "@prisma/client";

let mockCtx: IMockContext;
let ctx: IContext;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as IContext;
});

test("should create match and update pair successfully", async () => {
  const curDate = new Date();

  GDate.instance.setDate(curDate);

  const accReq = {
    id: 1,
    userId: 1,
    pairedId: 2,
    timestamp: curDate,
    hasMatched: false,
  };

  const pairedPair = {
    id: accReq.id,
    userId: accReq.pairedId,
    pairedId: accReq.userId,
    timestamp: curDate,
    hasMatched: false,
  };
  mockCtx.prisma.pair.findFirst.mockResolvedValue(pairedPair);


  const updatedCurPair = {
    ...accReq,
    hasMatched: true,
  };
  const updatedPairedPair = {
    ...pairedPair,
    hasMatched: true,
  }
  mockCtx.prisma.pair.update.mockResolvedValue(updatedPairedPair);
  mockCtx.prisma.pair.update.mockResolvedValue(updatedCurPair);

  const match: Match = {
    id: 2,
    userId1: accReq.userId,
    userId2: accReq.pairedId,
    timestamp: curDate,
    lastReadUser1: curDate,
    lastReadUser2: curDate,
  };
  mockCtx.prisma.match.create.mockResolvedValue(match);

  const transactionRes = [match, updatedPairedPair, updatedCurPair] as const;
  mockCtx.prisma.$transaction.mockResolvedValue(transactionRes);

  const matchUseCase = new MatchUseCase(ctx);
  await expect(matchUseCase.onAcceptPair(accReq)).resolves.toEqual(
    {
      match,
      pairedPair: updatedPairedPair,
      curPair: updatedCurPair,
    }
  );
});

test("should not create match if the pair has match or not found", async () => {
  const curDate = new Date();

  GDate.instance.setDate(curDate);

  const accReq = {
    id: 1,
    userId: 1,
    pairedId: 2,
    timestamp: curDate,
    hasMatched: false,
  };

  const pair = null;
  mockCtx.prisma.pair.findFirst.mockResolvedValue(pair);

  const matchUseCase = new MatchUseCase(ctx);
  await expect(matchUseCase.onAcceptPair(accReq)).resolves.toEqual(null);
});
