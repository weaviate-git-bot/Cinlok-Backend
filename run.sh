#!/bin/sh
pnpm prisma migrate dev --name init
pnpm prisma studio &
pnpm initvdb
pnpm dev
