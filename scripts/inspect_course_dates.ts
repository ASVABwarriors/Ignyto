const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_S1lrOiTLJGU9@ep-billowing-rice-atylagww-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });

  await client.connect();

  try {
    const coursesRes = await client.query('SELECT id, title, slug FROM "Course"');
    console.log(`Total courses in database: ${coursesRes.rows.length}`);

    for (const course of coursesRes.rows) {
      const datesRes = await client.query('SELECT * FROM "CourseDate" WHERE "courseId" = $1', [course.id]);
      console.log(`Course: "${course.title}" (${course.slug}) - Dates count: ${datesRes.rows.length}`);
      for (const d of datesRes.rows) {
        const slotsRes = await client.query('SELECT * FROM "CourseTimeSlot" WHERE "dateId" = $1', [d.id]);
        console.log(`  -> Date: ${d.dateStr} - Time Slots: ${slotsRes.rows.map((t: any) => t.timeStr).join(', ')}`);
      }
    }

  } catch (err) {
    console.error("Query error:", err);
  } finally {
    await client.end();
  }
}

run();
