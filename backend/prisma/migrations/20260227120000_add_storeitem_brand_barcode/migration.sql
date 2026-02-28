-- AlterTable (idempotent: safe if columns already exist)
ALTER TABLE "StoreItem" ADD COLUMN IF NOT EXISTS "brand" TEXT;
ALTER TABLE "StoreItem" ADD COLUMN IF NOT EXISTS "barcode" TEXT;
