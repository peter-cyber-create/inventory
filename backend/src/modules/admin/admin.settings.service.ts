import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export const adminSettingsService = {
  async list() {
    return prisma.systemSetting.findMany({ orderBy: { settingKey: 'asc' } });
  },

  async getOne(id: string) {
    const s = await prisma.systemSetting.findUnique({ where: { id } });
    if (!s) throw new AppError(404, 'Setting not found');
    return s;
  },

  async getByKey(key: string) {
    const s = await prisma.systemSetting.findUnique({ where: { settingKey: key } });
    if (!s) throw new AppError(404, 'Setting not found');
    return s;
  },

  async set(key: string, value: string) {
    return prisma.systemSetting.upsert({
      where: { settingKey: key },
      create: { settingKey: key, settingValue: value },
      update: { settingValue: value },
    });
  },

  async create(data: { settingKey: string; settingValue: string }) {
    const ex = await prisma.systemSetting.findUnique({ where: { settingKey: data.settingKey } });
    if (ex) throw new AppError(400, 'Setting key already exists');
    return prisma.systemSetting.create({ data });
  },

  async update(id: string, data: { settingValue: string }) {
    return prisma.systemSetting.update({ where: { id }, data });
  },

  async remove(id: string) {
    await prisma.systemSetting.delete({ where: { id } });
  },
};
