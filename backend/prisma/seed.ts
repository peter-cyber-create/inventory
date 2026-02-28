import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_ADMIN_PASSWORD = 'Admin@123';

async function main() {
  const dept = await prisma.department.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: { name: 'Administration', code: 'ADMIN' },
  });
  const role = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin' },
  });

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: 'admin@ims.local' },
    update: { passwordHash, username: 'admin' },
    create: {
      name: 'System Administrator',
      email: 'admin@ims.local',
      username: 'admin',
      passwordHash,
      departmentId: dept.id,
      roleId: role.id,
    },
  });
  console.log('Seed completed: department, role, admin user (login: admin@ims.local or admin / ' + DEFAULT_ADMIN_PASSWORD + ')');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
