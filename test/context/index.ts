import type { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import type DriveService from "../../src/service/drive";

export interface IMockContext {
  prisma: DeepMockProxy<PrismaClient>;
  drive: DeepMockProxy<typeof DriveService>;
  isMock: boolean;
};

export const createMockContext = (): IMockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
    drive: mockDeep<typeof DriveService>(),
    isMock: true,
  };
};
