-- Add missing engraved_number column to IctAsset to match Prisma schema
ALTER TABLE "IctAsset" ADD COLUMN IF NOT EXISTS "engraved_number" TEXT;

