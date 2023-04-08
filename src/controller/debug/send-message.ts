import { AsyncRoute } from "../../middleware/async-wrapper";
import ChatUseCase from "../../usecase/chat";

export const sendMessage = AsyncRoute(async (req,res) => {
  const {  accountId, message } = req.body;

  const msg = await ChatUseCase.sendMessageDebug(accountId, message);

  res.status(200).json({msg});
});