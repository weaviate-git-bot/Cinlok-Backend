import { AsyncRoute } from "../../middleware/async-wrapper";
import { sendMessageSchema } from "../../schema/chat-schema";
import ChatUseCase from "../../usecase/chat";

export const sendMessage = AsyncRoute(async (req, res) => {
  const { message:textMessage, to } = sendMessageSchema.parse(req.body);
  const { id: from } = res.locals.account;

  const message = await ChatUseCase.sendMessage(from, to, textMessage);

  res.status(200).json({message});
});