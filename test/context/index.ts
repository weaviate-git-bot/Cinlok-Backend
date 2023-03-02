import type { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";

export interface IMockContext {
  prisma: DeepMockProxy<PrismaClient>;
  isMock: boolean;
};

export const createMockContext = (): IMockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    isMock: true,
  };
};
