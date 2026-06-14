import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
const dbUrl = envFile.split('\n').find(l => l.startsWith('DATABASE_URL='))?.split('=')[1].replace(/"/g, '');
process.env.DATABASE_URL = dbUrl;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Dumping local database...');
  const users = await prisma.user.findMany();
  const courses = await prisma.course.findMany();
  const payments = await prisma.payment.findMany();

  const data = { users, courses, payments };

  fs.writeFileSync('db_backup.json', JSON.stringify(data, null, 2));
  console.log(`Database successfully exported to db_backup.json`);
  console.log(`Total cloned: ${users.length} users, ${courses.length} courses, ${payments.length} payments.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
