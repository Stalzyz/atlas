const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres@127.0.0.1:5432/atlas_prod' });
  await client.connect();
  const res = await client.query('SELECT count(*) FROM "Product";');
  console.log("Products in prod:", res.rows[0]);
  const res2 = await client.query('SELECT count(*) FROM "Order";');
  console.log("Orders in prod:", res2.rows[0]);
  await client.end();
}
main().catch(console.error);
