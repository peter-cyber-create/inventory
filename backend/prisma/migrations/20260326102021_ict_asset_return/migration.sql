-- AlterTable
ALTER TABLE "IctAsset" ADD COLUMN     "comments" TEXT,
ADD COLUMN     "year" INTEGER;

-- CreateTable
CREATE TABLE "IctAssetReturn" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "returned_by" TEXT NOT NULL,
    "reason" TEXT,
    "return_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IctAssetReturn_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IctAssetReturn" ADD CONSTRAINT "IctAssetReturn_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "IctAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
