import { AsyncRoute } from "../../middleware/async-wrapper";
import { getPairQuerySchema } from "../../schema";
import pairUseCase from "../../usecase/pair";

export const getPair = AsyncRoute(async (req, res) => {
  const { id } = res.locals.account;

  const {n} =  getPairQuerySchema.parse(req.query);

  const pairs = await pairUseCase.get(id, n);

  res.send({
    message: "Pairing success",
    pairs,
  });
});