const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres@127.0.0.1:5432/postgres' });
  await client.connect();
  const res = await client.query('SELECT datname FROM pg_database;');
  console.log("Databases:", res.rows.map(r => r.datname).join(', '));
  await client.end();
}
main().catch(console.error);
