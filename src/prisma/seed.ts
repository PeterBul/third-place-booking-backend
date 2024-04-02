import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as argon from 'argon2';

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

  const member = await prisma.role.upsert({
    where: { id: 1337 },
    update: {},
    create: {
      id: 1337,
      name: 'Member',
    },
  });

  const adminUser = await prisma.user.findFirst({
    where: {
      email: process.env.ADMIN_EMAIL,
    },
  });

  if (!adminUser) {
    await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL,
        hash: await argon.hash(process.env.ADMIN_PASS),
        isMemberBloom: false,
        isMemberThirdPlace: false,
        firstName: process.env.ADMIN_FIRST_NAME,
        lastName: process.env.ADMIN_LAST_NAME,
        confirmed: true,
        roles: {
          connect: {
            id: admin.id,
          },
        },
      },
    });
    await prisma.user.update({
      where: {
        email: process.env.ADMIN_EMAIL,
      },
      data: {
        roles: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  console.log({
    admin,
    user,
    member,
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
