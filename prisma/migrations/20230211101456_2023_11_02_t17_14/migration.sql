/*
  Warnings:

  - A unique constraint covering the columns `[userId,url]` on the table `UserPhoto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserPhoto_userId_url_key` ON `UserPhoto`(`userId`, `url`);
