-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "engraved_number" TEXT,
ADD COLUMN     "host_server_id" TEXT,
ADD COLUMN     "product_number" TEXT,
ADD COLUMN     "serial_number" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'physical';

-- CreateTable
CREATE TABLE "IctAssetRequisition" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "serial_no" TEXT,
    "model" TEXT,
    "requested_by" TEXT NOT NULL,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IctAssetRequisition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IctAssetDirectIssue" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "serial_no" TEXT,
    "model" TEXT,
    "issued_by" TEXT NOT NULL,
    "issued_to" TEXT NOT NULL,
    "department" TEXT,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IctAssetDirectIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IctAssetTransfer" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "previous_user" TEXT,
    "previous_dept" TEXT,
    "previous_title" TEXT,
    "user" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "title" TEXT,
    "office_no" TEXT,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IctAssetTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IctAssetDisposal" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "disposal_date" TIMESTAMP(3) NOT NULL,
    "disposal_method" TEXT NOT NULL,
    "disposal_reason" TEXT,
    "disposal_cost" DECIMAL(14,2),
    "disposed_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IctAssetDisposal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IctMaintenance" ADD CONSTRAINT "IctMaintenance_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_host_server_id_fkey" FOREIGN KEY ("host_server_id") REFERENCES "Server"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IctAssetRequisition" ADD CONSTRAINT "IctAssetRequisition_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "IctAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IctAssetDirectIssue" ADD CONSTRAINT "IctAssetDirectIssue_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "IctAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IctAssetTransfer" ADD CONSTRAINT "IctAssetTransfer_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "IctAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IctAssetDisposal" ADD CONSTRAINT "IctAssetDisposal_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "IctAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
