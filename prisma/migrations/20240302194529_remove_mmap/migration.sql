/*
  Warnings:

  - You are about to drop the column `description` on the `booking_items` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `booking_items` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `booking_items` table. All the data in the column will be lost.
  - You are about to drop the `booking_item_bookings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookingId` to the `booking_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `booking_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "booking_item_bookings" DROP CONSTRAINT "booking_item_bookings_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "booking_item_bookings" DROP CONSTRAINT "booking_item_bookings_bookingItemId_fkey";

-- DropForeignKey
ALTER TABLE "booking_items" DROP CONSTRAINT "booking_items_imageId_fkey";

-- AlterTable
ALTER TABLE "booking_items" DROP COLUMN "description",
DROP COLUMN "imageId",
DROP COLUMN "title",
ADD COLUMN     "bookingId" INTEGER NOT NULL,
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "booking_item_bookings";

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageId" INTEGER,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
