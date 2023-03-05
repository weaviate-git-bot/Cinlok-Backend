import { AsyncRoute } from "../../middleware/async-wrapper";
import pairUseCase from "../../usecase/pair";

export const getPair = AsyncRoute(async (_, res) => {
  const { id } = res.locals["account"];

  const pairs = await pairUseCase.get(id);

  res.send({
    message: "Pairing success",
    pairs,
  });
});