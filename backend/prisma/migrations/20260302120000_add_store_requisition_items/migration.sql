-- CreateTable
CREATE TABLE "StoreRequisitionItem" (
    "id" TEXT NOT NULL,
    "requisition_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity_requested" INTEGER NOT NULL,
    "quantity_approved" INTEGER,

    CONSTRAINT "StoreRequisitionItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StoreRequisitionItem" ADD CONSTRAINT "StoreRequisitionItem_requisition_id_fkey" FOREIGN KEY ("requisition_id") REFERENCES "StoreRequisition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreRequisitionItem" ADD CONSTRAINT "StoreRequisitionItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "StoreItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
