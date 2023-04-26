import type { Tag, PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import type { ModelOptionalId } from ".";


export interface ITagRepository {
    findAll(): Promise<Tag[]>;
    create(data: ModelOptionalId<Tag>): Promise<Tag>;
    findFirst(tag: string): Promise<Tag | null>;
}

export class TagRepository implements ITagRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findAll() {
    return this.prisma.tag.findMany();
  }

  create(data: ModelOptionalId<Tag>) {
    return this.prisma.tag.create({
      data,
    });
  }

  findFirst(tag: string) {
    return this.prisma.tag.findFirst({
      where: {
        tag,
      },
    });
  }
}

export const tagRepository = new TagRepository(prisma);
