-- Add missing ICT Maintenance date columns to match Prisma schema
ALTER TABLE "IctMaintenance" ADD COLUMN IF NOT EXISTS "maintenance_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "IctMaintenance" ADD COLUMN IF NOT EXISTS "next_service_date" TIMESTAMP(3);

