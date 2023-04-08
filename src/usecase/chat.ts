import type { Account } from "@prisma/client";
import context, { IContext } from "../context";

class ChatUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  async getChatUser(curAcc: Account) {
    // TODO: filter by matches
    const accounts = await this.ctx.prisma.account.findMany();

    const filtered = accounts.filter((acc) => acc.id !== curAcc.id);
    const withKeys = filtered.map((acc) => {
      const key = acc.id > curAcc.id ? `${curAcc.id}-${acc.id}` : `${acc.id}-${curAcc.id}`;
        
      return {
        ...acc,
        key,
      };
    });

    return withKeys;
  }
}

export default new ChatUseCase(context);
export { ChatUseCase };