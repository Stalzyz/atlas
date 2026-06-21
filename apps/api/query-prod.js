const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres@127.0.0.1:5432/raaghas_cert' });
  await client.connect();
  const res = await client.query('SELECT count(*) FROM "Product";');
  console.log("Products:", res.rows[0]);
  await client.end();
}
main().catch(console.error);
