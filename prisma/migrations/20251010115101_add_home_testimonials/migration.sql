-- CreateTable
CREATE TABLE "HomeTestimonial" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "userLocation" TEXT,
    "userReview" TEXT NOT NULL,
    "userProfile" TEXT,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeTestimonial_pkey" PRIMARY KEY ("id")
);
