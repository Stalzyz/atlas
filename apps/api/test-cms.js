const fetch = require('node-fetch');

async function testPages() {
  const baseUrl = 'http://localhost:6005';
  try {
    const res = await fetch(`${baseUrl}/api/v1/cms/pages`);
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testPages();
