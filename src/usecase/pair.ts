import context, { IContext } from "../context";
import MixerService from "../service/mixer";
import { GDate } from "../utils";
import matchUseCase from "./match";

// const PAIR_REFRESH_TIME = 60 * 60 * 1000;

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

  async get(userId: number) {
    // TODO: Implement omit by cache

    const oldPairs = await this.ctx.prisma.pair.findMany({
      where: {
        userId,
      },
    }).then((pairs) => pairs.map((p) => p.userId));

    const oldMatches = await this.ctx.prisma.match.findMany({
      where: {
        OR: [
          {
            userId1: userId,
          },
          {
            userId2: userId,
          },
        ],
      },
    }).then((matches) => matches.map((m) => m.userId1).concat(matches.map((m) => m.userId2)));

    const omit = oldPairs.concat(oldMatches);

    const nearest = await MixerService.getNearest(userId, 10, omit);

    const nearestUsers = await this.ctx.prisma.user.findMany({
      where: {
        id: {
          in: nearest,
        },
      },
      include: {
        userPhoto: {
          select: {
            fileId: true,
          }
        },
        userTag: {
          include: {
            tag: true,
          }
        }
      }
    });

    return nearestUsers;
  }
}

export default new PairUseCase(context);
export { PairUseCase };
