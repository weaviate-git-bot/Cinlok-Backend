import type { Request, Response } from "express";
import { AsyncRoute } from "../../middleware/async-wrapper";

export const self = AsyncRoute(async (_: Request, res: Response) => {
  const { id: ____, password: __, salt: ___, ...account } = res.locals['account'];
  res.send({
    message: "Get self success",
    account,
  });
});