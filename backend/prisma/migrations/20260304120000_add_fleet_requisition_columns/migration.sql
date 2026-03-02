-- Add missing FleetRequisition columns to match Prisma schema
ALTER TABLE "FleetRequisition" ADD COLUMN "project_unit" TEXT;
ALTER TABLE "FleetRequisition" ADD COLUMN "head_of_department" TEXT;
ALTER TABLE "FleetRequisition" ADD COLUMN "service_requesting_officer" TEXT;
ALTER TABLE "FleetRequisition" ADD COLUMN "driver_name" TEXT;
ALTER TABLE "FleetRequisition" ADD COLUMN "mobile" TEXT;
ALTER TABLE "FleetRequisition" ADD COLUMN "project_email" TEXT;
ALTER TABLE "FleetRequisition" ADD COLUMN "current_mileage" INTEGER;
ALTER TABLE "FleetRequisition" ADD COLUMN "last_service_mileage" INTEGER;
ALTER TABLE "FleetRequisition" ADD COLUMN "request_date" TIMESTAMP(3);
ALTER TABLE "FleetRequisition" ADD COLUMN "details" JSONB;

