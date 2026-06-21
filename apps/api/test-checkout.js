const fetch = require('node-fetch'); // wait, fetch is global in Node 18+

async function main() {
  const payload = {
    items: [{ variantId: "cm3tzyz", quantity: 1 }],
    customerInfo: { name: "Test User", email: "test@example.com", phone: "9999999999" },
    shippingAddress: { address: "123 Street", city: "City", state: "State", pincode: "123456" },
    gateway: "RAZORPAY",
    idempotencyKey: "test_key_123"
  };

  const res = await fetch('http://127.0.0.1:5002/api/v1/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
main().catch(console.error);
