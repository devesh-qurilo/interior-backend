-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

-- AlterTable
ALTER TABLE "ContactInquiry" ADD COLUMN     "status" "InquiryStatus" NOT NULL DEFAULT 'NEW';

-- CreateTable
CREATE TABLE "InquiryNote" (
    "id" SERIAL NOT NULL,
    "inquiryId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "adminName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InquiryNote" ADD CONSTRAINT "InquiryNote_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "ContactInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
