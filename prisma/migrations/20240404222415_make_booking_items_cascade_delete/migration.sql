-- DropForeignKey
ALTER TABLE "booking_items" DROP CONSTRAINT "booking_items_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "booking_items" DROP CONSTRAINT "booking_items_itemId_fkey";

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
