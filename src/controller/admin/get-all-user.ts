import type { Request, Response } from "express";
import userUseCase from "../../usecase/user";
import { AsyncRoute } from "../../middleware/async-wrapper";
import { LoginError } from "../../error";

const getAllUser = AsyncRoute(async (_: Request, res: Response) => {
  const users = await userUseCase.getAll();
  throw new LoginError();
  res.json(users);
})


export default getAllUser;