/*
  Warnings:

  - The `beforeImageUrl` column on the `RecentProject` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `afterImageUrl` column on the `RecentProject` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RecentProject" DROP COLUMN "beforeImageUrl",
ADD COLUMN     "beforeImageUrl" TEXT[],
DROP COLUMN "afterImageUrl",
ADD COLUMN     "afterImageUrl" TEXT[];
