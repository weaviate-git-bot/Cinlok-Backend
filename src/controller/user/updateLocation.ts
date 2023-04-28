import type { Request, Response } from "express";
import UserUseCase from "../../usecase/user";
import { AsyncRoute } from "../../middleware/async-wrapper";
import { updateLocationSchema } from "../../schema";

export const updateLocation = AsyncRoute(async (req: Request, res: Response) => {
  const account = res.locals.account;
  const id = account.id;
  const data = updateLocationSchema.parse(req.body);

  const user = await UserUseCase.updateLocation(id, data.latitude, data.longitude);
  res.send({
    message: "Update location success",
    user,
  });
});
