import context, { IContext } from "../context";
import MixerService from "../service/mixer";
import { GDate } from "../utils";
import matchUseCase from "./match";

const PAIR_REFRESH_TIME = parseInt(process.env["PAIR_REFRESH_TIME"] || "0") || 60 * 60 * 1000;
const PairCache : {[key: number] : {[key: number] : Date}} = {};

const DEG2RAD = Math.PI / 180;
function distanceLatLong(lat1:number, lon1: number, lat2: number, lon2: number) {
  const a = 0.5 -
    Math.cos((lat2 - lat1) * DEG2RAD)/2 + 
    Math.cos(lat1 * DEG2RAD) *
    Math.cos(lat2 * DEG2RAD) * 
    (1 - Math.cos((lon2 - lon1) * DEG2RAD))/2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
}

class PairUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  #updatePairCache(userId: number, pairedId: number) {
    if (!(userId in PairCache)) {
      PairCache[userId] = {};
    }

    PairCache[userId]![pairedId] = GDate.instance.now();
  }

  async reject(userId: number, pairedId: number) {
    this.#updatePairCache(userId, pairedId);

    return {
      pair: null,
    };
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

  async get(userId: number, n = 10) {
    const oldPairs = await this.ctx.prisma.pair.findMany({
      where: {
        userId,
      },
    }).then((pairs) => pairs.map((p) => p.pairedId));

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

    const omit = oldPairs.concat(oldMatches).concat(
      Object.keys(PairCache[userId] || {}).map((k) => parseInt(k)).filter(
        (k) => GDate.instance.now().getTime() - (PairCache[userId])![k]!.getTime() < PAIR_REFRESH_TIME
      )
    );

    const user = await this.ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        university: {
          include: {
            channel: true,
          }
        }
      }
    });
    if (!user || !user.university) return;

    const nearest = await MixerService.getNearest(userId, n, omit, user.university.channel.name);

    const users = await this.ctx.prisma.user.findMany({
      where: {
        id: {
          in: nearest,
        },
      },
      include: {
        university: {
          select: {
            name: true,
          }
        },
        userPhoto: {
          select: {
            fileId: true,
          }
        },
        userTag: {
          select: {
            tag: true,
          }
        }
      }
    });
    const nearestUsers = nearest.map((id) => users.find((u) => u.id === id)!).filter((u) => u !== undefined);

    const time = GDate.instance.now().getTime();
    const res = nearestUsers.map((u) => ({
      id: u.id,
      name: u.name,
      age: Math.floor((time - u.dateOfBirth.getTime()) / 3.15576e+10),
      university: u.university ? u.university.name : "",
      distance: distanceLatLong(user.latitude, user.longitude, u.latitude, u.longitude),
      userPhoto: u.userPhoto.map((p) => p.fileId),
      userTag: u.userTag.map((t) => t.tag.tag),
    }));
    return res;
  }
}

export default new PairUseCase(context);
export { PairUseCase };
