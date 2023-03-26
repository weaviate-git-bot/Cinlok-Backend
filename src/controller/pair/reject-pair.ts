import type { Request, Response } from "express";
import pairUseCase from "../../usecase/pair";
import { AsyncRoute } from "../../middleware/async-wrapper";
import { acceptPairSchema } from "../../schema";

export const rejectPair = AsyncRoute(async (req: Request, res: Response) => {
  const { pairedId } = acceptPairSchema.parse(req.body);
  const { id } = res.locals.account;

  const pair = await pairUseCase.reject(id, pairedId);

  res.send({
    message: "Reject pairing success",
    pair,
  });
});
