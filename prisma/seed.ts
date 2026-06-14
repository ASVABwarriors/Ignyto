import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/ignyto_portal?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = [
    {
      name: "Rohit",
      email: "rohit@nirmeva.com",
      phone: "0000000000",
      password: await bcrypt.hash("rohit", 10),
      role: "SUPERADMIN"
    },
    {
      name: "Priti",
      email: "sharmaprituu@gmail.com",
      phone: "0000000000",
      password: await bcrypt.hash("Priti@8642", 10),
      role: "SUPERADMIN"
    },
    {
      name: "Ignyto Admin",
      email: "superadmin@ignytotutoring.com",
      phone: "0000000000",
      password: await bcrypt.hash("superadmin123", 10),
      role: "SUPERADMIN"
    }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: u.password,
        role: "SUPERADMIN",
        isTwoFactorEnabled: false
      }
    });
  }
  
  console.log("Admin accounts successfully restored.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
