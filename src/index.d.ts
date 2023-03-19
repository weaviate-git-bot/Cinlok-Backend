import type { Account } from "@prisma/client";

declare global {
    namespace Express {
        interface Locals {
            account: Account;
        }
    }
}