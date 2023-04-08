import { AsyncRoute } from "../../middleware/async-wrapper";
import ChatUseCase from "../../usecase/chat";

export const getChat = AsyncRoute(async (_, res) => {
  const { id } = res.locals.account;

  const chats = await ChatUseCase.getChats(id);

  res.status(200).json({
    chats
  });
});