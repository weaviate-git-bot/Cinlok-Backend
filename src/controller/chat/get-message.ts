import { BadRequestError } from "../../error/client-error";
import { AsyncRoute } from "../../middleware/async-wrapper";
import { getMessageParamsSchema } from "../../schema/chat-schema";
import ChatUseCase from "../../usecase/chat";

export const getMessages = AsyncRoute(async (req, res) => {
  const { id: toId } = getMessageParamsSchema.parse(req.params);
  const { id: fromId } = res.locals.account;

  if (Number.isNaN(toId)) { 
    throw new BadRequestError("Invalid id");
  }

  const messages = await ChatUseCase.getMessages(fromId, toId);

  res.status(200).json({messages});
});