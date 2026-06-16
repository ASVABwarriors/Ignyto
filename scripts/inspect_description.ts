const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_S1lrOiTLJGU9@ep-billowing-rice-atylagww-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
  });

  await client.connect();

  try {
    const res = await client.query('SELECT description FROM "Course" WHERE "slug" = $1', ['fast-math-camp']);
    if (res.rows.length === 0) {
      console.log("Course not found!");
      return;
    }

    console.log("HTML Description for Fast Math Camp:\n");
    console.log(res.rows[0].description);
  } catch (err) {
    console.error("Query error:", err);
  } finally {
    await client.end();
  }
}

run();
