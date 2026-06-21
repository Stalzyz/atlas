const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres@localhost:5432/raaghas' });
  await client.connect();
  const res = await client.query('SELECT count(*) FROM "Product";');
  console.log("Products in raaghas:", res.rows[0]);
  const res2 = await client.query('SELECT count(*) FROM "Order";');
  console.log("Orders in raaghas:", res2.rows[0]);
  const res3 = await client.query('SELECT id, status, "userId", "customerEmail", "paymentIntentId", "paymentReference", "totalAmount" FROM "Order" ORDER BY "createdAt" DESC LIMIT 5;');
  console.log("Recent Orders:", res3.rows);
  await client.end();
}
main().catch(console.error);
