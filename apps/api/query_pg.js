const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://atlas_user:Atlas%40Prod2024@localhost:5432/atlas',
});
client.connect();
client.query('SELECT * FROM "Image" WHERE "productId" = (SELECT id FROM "Product" WHERE handle=\'premium-wear37261\');', (err, res) => {
  if (err) throw err;
  console.log(res.rows);
  client.end();
});
