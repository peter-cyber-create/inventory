-- Add missing ICT Maintenance cost column to match Prisma schema
ALTER TABLE "IctMaintenance" ADD COLUMN IF NOT EXISTS "cost" DECIMAL(14,2);

