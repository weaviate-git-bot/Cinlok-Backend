import type { University, PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import type { ModelOptionalId, AllOptional } from ".";

export interface IUniversityRepository {
    findByName(name: string): Promise<University[]>;
    findBySlug(slug: string): Promise<University | null>;
    create(name: string, slug: string): Promise<University>;
    update(slug: string, data: AllOptional<University>): Promise<University>;
}

export class UniversityRepository implements IUniversityRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findByName(name: string) {
    return this.prisma.university.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }
  findBySlug(slug: string) {
    return this.prisma.university.findFirst({
      where: {
        slug,
      },
    });
  }
  create(name: string, slug: string) {
    return this.prisma.university.create({
      data: {
        name,
        slug,
        channel: {
          create: {
            name,
          },
        }
      },
    });
  }
  update(slug: string, data: ModelOptionalId<University>) {
    return this.prisma.university.update({
      where: {
        slug,
      },
      data,
    });
  }
}

export const universityRepository = new UniversityRepository(prisma);
