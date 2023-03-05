import type { Tag } from "@prisma/client";
import context, { IContext } from "../context";

class TagUseCase {
  private ctx: IContext;

  constructor(context: IContext) {
    this.ctx = context;
  }

  async getAll(): Promise<Tag[]> {
    const tags = await this.ctx.prisma.tag.findMany();
    return tags;
  }

  async addTag(tag: string): Promise<Tag> {
    const existingTag = await this.ctx.prisma.tag.findFirst({
      where: {
        tag,
      },
    });
    if (existingTag) {
      return existingTag;
    } else {
      return await this.ctx.prisma.tag.create({
        data: {
          tag,
        },
      });
    }
  }
}

export default new TagUseCase(context);
export { TagUseCase };