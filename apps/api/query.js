const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres@127.0.0.1:5432/atlas_cert' });
  await client.connect();
  const res = await client.query('SELECT id, status, "userId", "customerEmail", "createdAt", "orderNumber", "formattedOrderNumber" FROM "Order" ORDER BY "createdAt" DESC LIMIT 5;');
  console.log("Found orders:", res.rows.length);
  res.rows.forEach(r => console.log(r));
  await client.end();
}

main().catch(console.error);
