-- Add missing SparePart columns to match Prisma schema (idempotent)
ALTER TABLE "SparePart" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "SparePart" ADD COLUMN IF NOT EXISTS "brand" TEXT;
ALTER TABLE "SparePart" ADD COLUMN IF NOT EXISTS "unit_price" DECIMAL(12,2);
ALTER TABLE "SparePart" ADD COLUMN IF NOT EXISTS "unit_of_measure" TEXT;

-- Add missing ReceivingRecord columns to match Prisma schema (idempotent)
ALTER TABLE "ReceivingRecord" ADD COLUMN IF NOT EXISTS "transport_officer" TEXT;
ALTER TABLE "ReceivingRecord" ADD COLUMN IF NOT EXISTS "old_number_plates" TEXT;
ALTER TABLE "ReceivingRecord" ADD COLUMN IF NOT EXISTS "new_number_plates" TEXT;
ALTER TABLE "ReceivingRecord" ADD COLUMN IF NOT EXISTS "driver_name" TEXT;
ALTER TABLE "ReceivingRecord" ADD COLUMN IF NOT EXISTS "mileage" INTEGER;
ALTER TABLE "ReceivingRecord" ADD COLUMN IF NOT EXISTS "checklist" JSONB;
ALTER TABLE "ReceivingRecord" ADD COLUMN IF NOT EXISTS "remarks" TEXT;
ALTER TABLE "ReceivingRecord" ADD COLUMN IF NOT EXISTS "user_signature" TEXT;
ALTER TABLE "ReceivingRecord" ADD COLUMN IF NOT EXISTS "accepted_by" TEXT;

-- Add missing FinanceActivity columns to match Prisma schema (idempotent)
ALTER TABLE "FinanceActivity" ADD COLUMN IF NOT EXISTS "activity_type" TEXT;
ALTER TABLE "FinanceActivity" ADD COLUMN IF NOT EXISTS "department_id" TEXT;
ALTER TABLE "FinanceActivity" ADD COLUMN IF NOT EXISTS "invoice_date" TIMESTAMP(3);
ALTER TABLE "FinanceActivity" ADD COLUMN IF NOT EXISTS "voucher_number" TEXT;
ALTER TABLE "FinanceActivity" ADD COLUMN IF NOT EXISTS "funder" TEXT;
ALTER TABLE "FinanceActivity" ADD COLUMN IF NOT EXISTS "status" TEXT;
ALTER TABLE "FinanceActivity" ADD COLUMN IF NOT EXISTS "days" INTEGER;
ALTER TABLE "FinanceActivity" ADD COLUMN IF NOT EXISTS "participants" JSONB;

