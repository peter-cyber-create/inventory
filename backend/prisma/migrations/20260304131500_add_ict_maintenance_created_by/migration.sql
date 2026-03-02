-- Add missing ICT Maintenance created_by column to match Prisma schema
ALTER TABLE "IctMaintenance" ADD COLUMN IF NOT EXISTS "created_by" TEXT;

