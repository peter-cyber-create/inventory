-- Add missing funding_source column to IctAsset to match Prisma schema
ALTER TABLE "IctAsset" ADD COLUMN IF NOT EXISTS "funding_source" TEXT;

