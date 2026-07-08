const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres@127.0.0.1:5432/atlas_cert' });
client.connect().then(() => {
  return client.query('SELECT COUNT(*) FROM "Product";');
}).then(res => {
  console.log('All Products Count:', res.rows[0].count);
  return client.query('SELECT title, handle FROM "Product" LIMIT 5;');
}).then(res => {
  console.log('Sample Products:', res.rows);
  client.end();
}).catch(console.error);
