import prisma from "./prisma";

export type ModelOptionalId<T> = Omit<T, "id"> & {
    id?: number;
};

export type AllOptional<T> = {
    [P in keyof T]?: T[P];
};

export default prisma;
export * from "./tag";
export * from "./account";
export * from "./university";
