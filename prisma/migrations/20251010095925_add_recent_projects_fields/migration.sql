-- CreateTable
CREATE TABLE "RecentProject" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "propertyType" TEXT,
    "area" TEXT,
    "layout" TEXT,
    "location" TEXT,
    "designHighlights" TEXT[],
    "beforeImageUrl" TEXT,
    "afterImageUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecentProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecentProject_slug_key" ON "RecentProject"("slug");
