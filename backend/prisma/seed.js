"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
