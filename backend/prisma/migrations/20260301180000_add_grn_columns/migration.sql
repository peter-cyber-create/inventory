-- Add missing columns to GoodsReceivedNote (schema had them; init migration did not)
ALTER TABLE "GoodsReceivedNote" ADD COLUMN IF NOT EXISTS "contract_no" TEXT;
ALTER TABLE "GoodsReceivedNote" ADD COLUMN IF NOT EXISTS "lpo_no" TEXT;
ALTER TABLE "GoodsReceivedNote" ADD COLUMN IF NOT EXISTS "delivery_note_no" TEXT;
ALTER TABLE "GoodsReceivedNote" ADD COLUMN IF NOT EXISTS "tax_invoice_no" TEXT;
ALTER TABLE "GoodsReceivedNote" ADD COLUMN IF NOT EXISTS "grn_no" TEXT;
ALTER TABLE "GoodsReceivedNote" ADD COLUMN IF NOT EXISTS "supplier_contact" TEXT;
ALTER TABLE "GoodsReceivedNote" ADD COLUMN IF NOT EXISTS "delivery_location" TEXT;
ALTER TABLE "GoodsReceivedNote" ADD COLUMN IF NOT EXISTS "remarks" TEXT;

-- Add missing columns to StoreRequisition (schema had them; init did not)
ALTER TABLE "StoreRequisition" ADD COLUMN IF NOT EXISTS "serial_number" TEXT;
ALTER TABLE "StoreRequisition" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "StoreRequisition" ADD COLUMN IF NOT EXISTS "ministry" TEXT;
ALTER TABLE "StoreRequisition" ADD COLUMN IF NOT EXISTS "from_department" TEXT;
ALTER TABLE "StoreRequisition" ADD COLUMN IF NOT EXISTS "to_store" TEXT;
ALTER TABLE "StoreRequisition" ADD COLUMN IF NOT EXISTS "purpose" TEXT;
