const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres@127.0.0.1:5432/raaghas_cert' });
  await client.connect();
  const res = await client.query(`
    SELECT tablename FROM pg_catalog.pg_tables 
    WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';
  `);
  console.log("Tables:", res.rows.map(r => r.tablename).join(', '));
  await client.end();
}
main().catch(console.error);
