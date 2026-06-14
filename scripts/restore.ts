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
  if (!fs.existsSync('db_backup.json')) {
    console.error('db_backup.json not found! Please run the dump script first.');
    process.exit(1);
  }

  console.log('Reading db_backup.json...');
  const raw = fs.readFileSync('db_backup.json', 'utf8');
  const data = JSON.parse(raw);

  console.log(`Restoring ${data.users.length} users, ${data.courses.length} courses, ${data.payments.length} payments...`);

  // Restore Users
  let usersRestored = 0;
  for (const user of data.users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        password: user.password,
        twoFactorSecret: user.twoFactorSecret,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        role: user.role,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }
    });
    usersRestored++;
  }
  console.log(`✅ ${usersRestored} Users restored.`);

  // Restore Courses
  let coursesRestored = 0;
  for (const course of data.courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        fee: course.fee,
        duration: course.duration,
        dailyHours: course.dailyHours,
        category: course.category,
        classMode: course.classMode,
        imageName: course.imageName,
        thumbnailUrl: course.thumbnailUrl,
        pdfUrl: course.pdfUrl,
        syllabus: course.syllabus,
        // startDate: course.startDate ? new Date(course.startDate) : null,
        // timezone: course.timezone,
        createdAt: new Date(course.createdAt),
        updatedAt: new Date(course.updatedAt)
      }
    });
    coursesRestored++;
  }
  console.log(`✅ ${coursesRestored} Courses restored.`);

  // Restore Payments
  let paymentsRestored = 0;
  for (const payment of data.payments) {
    await prisma.payment.upsert({
      where: { paypalOrderId: payment.paypalOrderId },
      update: {},
      create: {
        id: payment.id,
        userId: payment.userId,
        courseId: payment.courseId,
        paypalOrderId: payment.paypalOrderId,
        amount: payment.amount,
        status: payment.status,
        createdAt: new Date(payment.createdAt),
        updatedAt: new Date(payment.updatedAt)
      }
    });
    paymentsRestored++;
  }
  console.log(`✅ ${paymentsRestored} Payments restored.`);

  console.log('🎉 Database successfully cloned to Neon DB!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
