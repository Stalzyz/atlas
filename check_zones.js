const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://atlas_user:Atlas%40Prod2024@localhost:5432/atlas' });
async function check() {
  await client.connect();
  const res = await client.query('SELECT name, regions FROM "ShippingZone"');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
check();
