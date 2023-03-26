import type { Request, Response } from "express";
import { AsyncRoute } from "../../middleware/async-wrapper";
import chatUseCase from "../../usecase/chat";

export const users = AsyncRoute(async (_: Request, res: Response) => {
  const acc = res.locals.account;
  
  const users = await chatUseCase.getChatUser(acc);
  
  res.send({
    message: "Get users chat success",
    users,
  });
});