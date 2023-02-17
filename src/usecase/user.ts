import context, { IContext } from "../context";

class UserUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  async getAll() {
    return this.ctx.prisma.user.findMany({
      include: {
        userPhoto: true,
        userTag: true,
        account: true,
        pair: true,
        match: true,
      }
    });
  }
}

export default new UserUseCase(context);
export { UserUseCase };