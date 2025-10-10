/*
  Warnings:

  - You are about to drop the column `ImageUrl` on the `RecentProject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecentProject" DROP COLUMN "ImageUrl",
ADD COLUMN     "imageUrl" TEXT[];
