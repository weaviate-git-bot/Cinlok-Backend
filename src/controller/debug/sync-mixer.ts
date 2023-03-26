import { AsyncRoute } from "../../middleware/async-wrapper";
import UserUseCase from "../../usecase/user";

export const syncMixer = AsyncRoute(async (_, res) => {
  const mixer = await UserUseCase.mixerSync();
  res.send({
    message: "Sync mixer success",
    mixer,
  });
});