-- DropForeignKey
ALTER TABLE "booking_items" DROP CONSTRAINT "booking_items_imageId_fkey";

-- AlterTable
ALTER TABLE "booking_items" ALTER COLUMN "imageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
