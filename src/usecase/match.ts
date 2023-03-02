import type { Pair } from "@prisma/client";
import context, { IContext } from "../context";
import { GDate } from "../utils";

class MatchUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  async onAcceptPair(data: Pair) {
    const pair = await this.ctx.prisma.pair.findFirst({
      where: {
        userId: data.pairedId,
        pairedId: data.userId,
        hasMatched: false,
      },
    });

    if (!pair) {
      return null;
    }

    const res = await this.ctx.prisma.$transaction([
      this.ctx.prisma.match.create({
        data: {
          userId1: data.userId,
          userId2: data.pairedId,
          timestamp: GDate.instance.now(),
        },
      }),
      this.ctx.prisma.pair.update({
        where: {
          id: pair.id,
        },
        data: {
          hasMatched: true,
        },
      }),
      this.ctx.prisma.pair.update({
        where: {
          id: data.id,
        },
        data: {
          hasMatched: true,
        },
      }),
    ]);
    
    return {
      match: res[0],
      pairedPair: res[1],
      curPair: res[2],
    };
  }
}

export default new MatchUseCase(context);
export { MatchUseCase };
