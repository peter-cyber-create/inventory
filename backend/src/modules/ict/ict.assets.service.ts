import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const ictAssetsService = {
  async list(filters?: { status?: string; category?: string; search?: string; page?: number; limit?: number }) {
    const where: { status?: string; category?: string; OR?: { assetTag?: { contains: string; mode: 'insensitive' }; name?: { contains: string; mode: 'insensitive' }; serialNumber?: { contains: string; mode: 'insensitive' } }[] } = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;
    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { assetTag: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { serialNumber: { contains: q, mode: 'insensitive' } },
      ];
    }
    const page = Math.max(1, filters?.page ?? 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, filters?.limit ?? DEFAULT_LIMIT));
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.ictAsset.findMany({
        where,
        include: { assignedTo: { select: { id: true, name: true, email: true } } },
        orderBy: { assetTag: 'asc' },
        skip,
        take: limit,
      }),
      prisma.ictAsset.count({ where }),
    ]);
    return { data, total, page, limit };
  },

  async getOne(id: string) {
    const a = await prisma.ictAsset.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        maintenance: true,
        issues: true,
        assetRequisitions: true,
        directIssues: true,
        transfers: true,
        disposals: true,
        returns: true,
      },
    });
    if (!a) throw new AppError(404, 'ICT asset not found');
    return a;
  },

  async create(data: {
    assetTag: string;
    name: string;
    category: string;
    serialNumber?: string;
    status?: string;
    location?: string;
    assignedToId?: string;
    purchaseDate?: Date;
  }) {
    const ex = await prisma.ictAsset.findUnique({ where: { assetTag: data.assetTag } });
    if (ex) throw new AppError(400, 'Asset tag already exists');
    return prisma.ictAsset.create({
      data: {
        assetTag: data.assetTag,
        name: data.name,
        category: data.category,
        serialNumber: data.serialNumber,
        status: data.status ?? 'available',
        location: data.location,
        assignedToId: data.assignedToId,
        purchaseDate: data.purchaseDate,
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
  },

  async update(id: string, data: Partial<{
    assetTag: string;
    name: string;
    category: string;
    serialNumber: string;
    status: string;
    location: string;
    assignedToId: string | null;
    purchaseDate: Date | null;
  }>) {
    if (data.assetTag) {
      const ex = await prisma.ictAsset.findFirst({ where: { assetTag: data.assetTag, NOT: { id } } });
      if (ex) throw new AppError(400, 'Asset tag already exists');
    }
    return prisma.ictAsset.update({
      where: { id },
      data,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
  },

  async remove(id: string) {
    await prisma.ictAsset.delete({ where: { id } });
  },

  async bulkCreate(data: {
    rows: {
      asset: string;
      model: string;
      serialNo?: string;
      engravedNo?: string;
      funding?: string;
      category: string;
    }[];
  }) {
    if (!data.rows.length) throw new AppError(400, 'No asset rows provided');
    const created = await prisma.$transaction(async (tx) => {
      const assets = [];
      for (let i = 0; i < data.rows.length; i += 1) {
        const row = data.rows[i];
        if (!row.serialNo?.trim()) {
          throw new AppError(400, `Serial number is required for row ${i + 1}`);
        }
        const assetTag = `ICT-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`;
        const a = await tx.ictAsset.create({
          data: {
            assetTag,
            name: row.asset,
            category: row.category,
            serialNumber: row.serialNo.trim(),
            status: 'available',
          },
        });
        assets.push(a);
      }
      return assets;
    });
    return created;
  },

  async createPerAssetRequisition(data: {
    assetId: string;
    serialNo?: string;
    model?: string;
    requestedBy: string;
    comments?: string;
  }) {
    return prisma.ictAssetRequisition.create({
      data: {
        assetId: data.assetId,
        serialNo: data.serialNo,
        model: data.model,
        requestedBy: data.requestedBy,
        comments: data.comments,
      },
    });
  },

  async createDirectIssue(data: {
    assetId: string;
    serialNo?: string;
    model?: string;
    issuedBy: string;
    issuedTo: string;
    department?: string;
    title?: string;
  }) {
    const issue = await prisma.ictAssetDirectIssue.create({
      data: {
        assetId: data.assetId,
        serialNo: data.serialNo,
        model: data.model,
        issuedBy: data.issuedBy,
        issuedTo: data.issuedTo,
        department: data.department,
        title: data.title,
      },
    });
    // Optionally mark asset as assigned
    await prisma.ictAsset.update({
      where: { id: data.assetId },
      data: { status: 'assigned' },
    });
    return issue;
  },

  async assignStaff(data: { assetId: string; staffId: string }) {
    return prisma.ictAsset.update({
      where: { id: data.assetId },
      data: { assignedToId: data.staffId, status: 'assigned' },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
  },

  async transferOwnership(data: {
    assetId: string;
    user: string;
    department: string;
    title?: string;
    officeNo?: string;
    reason?: string;
    previousUser?: string | null;
    previousDept?: string | null;
    previousTitle?: string | null;
  }) {
    const asset = await prisma.ictAsset.findUnique({
      where: { id: data.assetId },
      select: { status: true },
    });
    if (!asset) throw new AppError(404, 'ICT asset not found');
    if (asset.status !== 'available') {
      throw new AppError(400, 'Return asset before transfer or disposal');
    }

    const transfer = await prisma.ictAssetTransfer.create({
      data: {
        assetId: data.assetId,
        previousUser: data.previousUser ?? undefined,
        previousDept: data.previousDept ?? undefined,
        previousTitle: data.previousTitle ?? undefined,
        user: data.user,
        department: data.department,
        title: data.title,
        officeNo: data.officeNo,
        reason: data.reason,
      },
    });
    await prisma.ictAsset.update({
      where: { id: data.assetId },
      data: { location: data.department, status: 'assigned', assignedToId: null },
    });
    return transfer;
  },

  async disposeAsset(data: {
    assetId: string;
    disposalDate: Date;
    disposalMethod: string;
    disposalReason?: string;
    disposalCost?: number;
    disposedBy: string;
  }) {
    const asset = await prisma.ictAsset.findUnique({
      where: { id: data.assetId },
      select: { status: true },
    });
    if (!asset) throw new AppError(404, 'ICT asset not found');
    if (asset.status !== 'available') {
      throw new AppError(400, 'Return asset before transfer or disposal');
    }

    const disposal = await prisma.ictAssetDisposal.create({
      data: {
        assetId: data.assetId,
        disposalDate: data.disposalDate,
        disposalMethod: data.disposalMethod,
        disposalReason: data.disposalReason,
        disposalCost: data.disposalCost != null ? data.disposalCost : undefined,
        disposedBy: data.disposedBy,
      },
    });
    await prisma.ictAsset.update({
      where: { id: data.assetId },
      data: { status: 'disposed' },
    });
    return disposal;
  },

  async returnAsset(data: { assetId: string; returnedBy: string; reason?: string }) {
    const asset = await prisma.ictAsset.findUnique({
      where: { id: data.assetId },
      select: { status: true, assignedToId: true },
    });
    if (!asset) throw new AppError(404, 'ICT asset not found');
    if (asset.status === 'available') {
      throw new AppError(400, 'Asset is already returned to inventory');
    }

    const ret = await prisma.ictAssetReturn.create({
      data: {
        assetId: data.assetId,
        returnedBy: data.returnedBy,
        reason: data.reason,
      },
    });

    await prisma.ictAsset.update({
      where: { id: data.assetId },
      data: {
        status: 'available',
        assignedToId: null,
        location: null,
      },
    });
    return ret;
  },
};
