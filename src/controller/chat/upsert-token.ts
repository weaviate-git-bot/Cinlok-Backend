import { AsyncRoute } from "../../middleware/async-wrapper";
import { upsertTokenSchema } from "../../schema/chat-schema";
import ChatUseCase from "../../usecase/chat";

export const upsertToken = AsyncRoute(async (req, res) => {
  const {token} = upsertTokenSchema.parse(req.body);
  const {id: accountId} = res.locals.account;  

  const accountToken = await ChatUseCase.upsertToken(accountId, token);

  res.status(200).json({
    accountToken,
  });
});
