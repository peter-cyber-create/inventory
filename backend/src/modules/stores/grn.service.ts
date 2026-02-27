import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';
import { Decimal } from '@prisma/client/runtime/library';

export const grnService = {
  async list() {
    return prisma.goodsReceivedNote.findMany({
      include: { items: { include: { item: true } } },
      orderBy: { receivedDate: 'desc' },
    });
  },

  async getOne(id: string) {
    const grn = await prisma.goodsReceivedNote.findUnique({
      where: { id },
      include: { items: { include: { item: true } } },
    });
    if (!grn) throw new AppError(404, 'GRN not found');
    return grn;
  },

  async create(data: {
    supplier?: string;
    contractNo?: string;
    lpoNo?: string;
    deliveryNoteNo?: string;
    taxInvoiceNo?: string;
    grnNo?: string;
    supplierContact?: string;
    remarks?: string;
    receivedById?: string;
    items: { itemId: string; quantity: number; unitPrice?: number }[];
  }) {
    const itemIds = data.items.map((i) => i.itemId);
    const items = await prisma.storeItem.findMany({ where: { id: { in: itemIds } } });
    if (items.length !== itemIds.length) throw new AppError(400, 'One or more item IDs invalid');

    const grn = await prisma.$transaction(async (tx) => {
      const note = await tx.goodsReceivedNote.create({
        data: {
          supplier: data.supplier,
          receivedById: data.receivedById ?? null,
          contractNo: data.contractNo,
          lpoNo: data.lpoNo,
          deliveryNoteNo: data.deliveryNoteNo,
          taxInvoiceNo: data.taxInvoiceNo,
          grnNo: data.grnNo,
          supplierContact: data.supplierContact,
          remarks: data.remarks,
        },
      });
      for (const line of data.items) {
        const item = items.find((i) => i.id === line.itemId)!;
        const newBalance = item.quantityInStock + line.quantity;
        await tx.grnItem.create({
          data: {
            grnId: note.id,
            itemId: line.itemId,
            quantity: line.quantity,
            unitPrice: line.unitPrice != null ? new Decimal(line.unitPrice) : null,
          },
        });
        await tx.storeItem.update({
          where: { id: line.itemId },
          data: { quantityInStock: newBalance },
        });
        await tx.stockLedger.create({
          data: {
            itemId: line.itemId,
            transactionType: 'IN',
            quantity: line.quantity,
            balanceAfter: newBalance,
          },
        });
      }
      return tx.goodsReceivedNote.findUnique({
        where: { id: note.id },
        include: { items: { include: { item: true } } },
      });
    });
    return grn!;
  },

  async remove(id: string) {
    const grn = await prisma.goodsReceivedNote.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!grn) throw new AppError(404, 'GRN not found');
    await prisma.$transaction(async (tx) => {
      for (const line of grn.items) {
        const item = await tx.storeItem.findUnique({ where: { id: line.itemId } });
        if (item) {
          const newBalance = Math.max(0, item.quantityInStock - line.quantity);
          await tx.storeItem.update({
            where: { id: line.itemId },
            data: { quantityInStock: newBalance },
          });
          await tx.stockLedger.create({
            data: {
              itemId: line.itemId,
              transactionType: 'ADJUST',
              quantity: -line.quantity,
              balanceAfter: newBalance,
            },
          });
        }
      }
      await tx.grnItem.deleteMany({ where: { grnId: id } });
      await tx.goodsReceivedNote.delete({ where: { id } });
    });
  },
};
