import type { Request, Response } from "express";
import pairUseCase from "../../usecase/pair";
import { AsyncRoute } from "../../middleware/async-wrapper";
import { acceptPairSchema } from "../../schema";
import type { Account } from "@prisma/client";

export const acceptPair = AsyncRoute(async (req: Request, res: Response) => {
  const { pairedId } = acceptPairSchema.parse(req.body);
  const { id } = res.locals["account"] as Account;

  const pair = await pairUseCase.accept(id, pairedId);

  res.send({
    message: "Pairing success",
    pair,
  });
});
