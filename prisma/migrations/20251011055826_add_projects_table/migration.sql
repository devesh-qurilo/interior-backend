/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "coverUrl",
DROP COLUMN "summary",
DROP COLUMN "tags",
ADD COLUMN     "afterImageUrl" TEXT[],
ADD COLUMN     "area" TEXT,
ADD COLUMN     "beforeImageUrl" TEXT[],
ADD COLUMN     "designHighlights" TEXT[],
ADD COLUMN     "imageUrl" TEXT[],
ADD COLUMN     "layout" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "propertyType" TEXT;
