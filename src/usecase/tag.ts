import type { Tag } from "@prisma/client";
import context, { IContext } from "../context";
import { tagRepository, ITagRepository } from "../repository";

export interface ITagContext extends IContext {
  repository: ITagRepository;
}

class TagUseCase {
  private ctx: ITagContext;

  constructor(ctx: ITagContext) {
    this.ctx = ctx;
  }

  async getAll(): Promise<Tag[]> {
    const tags = await this.ctx.repository.findAll();
    return tags;
  }

  async addTag(tag: string): Promise<Tag> {
    const existingTag = await this.ctx.repository.findFirst(tag);

    if (existingTag) {
      return existingTag;
    } else {
      return await this.ctx.repository.create({
        tag,
      });
    }
  }
}

export default new TagUseCase({
  ...context,
  repository: tagRepository,
});
export { TagUseCase };