import context, { IContext } from "../context";
import { GDate } from "../utils";
import matchUseCase from "./match";

class PairUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  async accept(userId: number, pairedId: number) {
    const pair = await this.create(userId, pairedId);

    const matchPair = await matchUseCase.onAcceptPair(pair);

    if (!matchPair) {
      return {
        pair,
        match: null,
      };
    }

    return {
      pair: matchPair.curPair,
      match: matchPair.match,
    };
  }

  async create(userId: number, pairedId: number) {
    const data = {
      userId,
      pairedId,
      timestamp: GDate.instance.now(),
    };

    const pair = await this.ctx.prisma.pair.create({
      data,
    });

    return pair;
  }
}

export default new PairUseCase(context);
export { PairUseCase };
