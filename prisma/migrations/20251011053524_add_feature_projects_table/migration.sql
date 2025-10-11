-- CreateTable
CREATE TABLE "FeatureProject" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "propertyType" TEXT,
    "area" TEXT,
    "layout" TEXT,
    "location" TEXT,
    "designHighlights" TEXT[],
    "beforeImageUrl" TEXT[],
    "afterImageUrl" TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT[],

    CONSTRAINT "FeatureProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeatureProject_slug_key" ON "FeatureProject"("slug");
