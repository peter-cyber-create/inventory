-- AlterTable
ALTER TABLE "ReceivingRecord" ADD COLUMN     "vehicle_id" TEXT;

-- AddForeignKey
ALTER TABLE "ReceivingRecord" ADD CONSTRAINT "ReceivingRecord_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
