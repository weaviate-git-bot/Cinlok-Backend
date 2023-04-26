// import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";

export type ModelOptionalId<T> = Omit<T, "id"> & {
    id?: number;
};

export type AllOptional<T> = {
    [P in keyof T]?: T[P];
};

// const prisma = new PrismaClient();

export default prisma;
export * from "./tag";
export * from "./account";
export * from "./university";
