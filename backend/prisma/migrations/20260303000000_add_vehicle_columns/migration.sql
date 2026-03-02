-- Add missing Vehicle columns (old_number_plate, new_number_plate, type, chassis_number, etc.)
ALTER TABLE "Vehicle" ADD COLUMN "old_number_plate" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "new_number_plate" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "type" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "chassis_number" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "engine_number" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "fuel" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "power" INTEGER;
ALTER TABLE "Vehicle" ADD COLUMN "total_cost" DECIMAL(14,2);
ALTER TABLE "Vehicle" ADD COLUMN "country_of_origin" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "color" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "user_department" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "officer" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "contact" TEXT;
