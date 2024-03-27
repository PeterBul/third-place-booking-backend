import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.role.upsert({
    where: { id: 5150 },
    update: {},
    create: {
      id: 5150,
      name: 'Admin',
    },
  });

  const user = await prisma.role.upsert({
    where: { id: 2001 },
    update: {},
    create: {
      id: 2001,
      name: 'User',
    },
  });
  console.log({
    admin,
    user,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
