import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  // Core permissions
  const permissionDefs = [
    { key: 'dashboard.view', label: 'View dashboard', module: 'dashboard' },
    { key: 'stores.items.manage', label: 'Manage store items', module: 'stores' },
    { key: 'stores.grn.manage', label: 'Manage GRNs', module: 'stores' },
    { key: 'stores.requisitions.manage', label: 'Manage store requisitions', module: 'stores' },
    { key: 'stores.issues.manage', label: 'Manage store issues', module: 'stores' },
    { key: 'ict.assets.manage', label: 'Manage ICT assets', module: 'ict' },
    { key: 'fleet.vehicles.manage', label: 'Manage vehicles', module: 'fleet' },
    { key: 'finance.activities.manage', label: 'Manage finance activities', module: 'finance' },
    { key: 'admin.users.manage', label: 'Manage users', module: 'admin' },
    { key: 'admin.roles.manage', label: 'Manage roles', module: 'admin' },
    { key: 'admin.settings.manage', label: 'Manage system settings', module: 'admin' },
    { key: 'reports.view', label: 'View system reports', module: 'reports' },
  ];

  const permissions = await Promise.all(
    permissionDefs.map((p) =>
      prisma.permission.upsert({
        where: { key: p.key },
        update: { label: p.label, module: p.module },
        create: p,
      }),
    ),
  );

  // Link all permissions to Admin role
  await Promise.all(
    permissions.map((perm) =>
      prisma.rolePermission.upsert({
        where: { role_id_permission_id: { role_id: role.id, permission_id: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      }),
    ),
  );

  await prisma.user.upsert({
    where: { email: 'admin@ims.local' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@ims.local',
      departmentId: dept.id,
      roleId: role.id,
    },
  });
  console.log('Seed completed: department, role, admin user.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
