const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@atlas.in';
  const newPass = 'atlas2024';
  console.log(`🔒 [ATOMIC] Resetting password for ${email}...`);
  const hashedPassword = await bcrypt.hash(newPass, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'ADMIN' },
    create: { email, password: hashedPassword, role: 'ADMIN', name: 'Atlas Admin' }
  });
  console.log(`✅ Success! Use: ${newPass}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
