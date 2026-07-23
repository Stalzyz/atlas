const { PrismaClient } = require('./generated-client/index.js');
const prisma = new PrismaClient({ datasources: { db: { url: 'postgresql://raaghas_user:Raaghas%40Prod2024@localhost:5432/raaghas' } } });

async function main() {
  console.log("Fetching current settings...");
  const settings = await prisma.storeSettings.findFirst();
  if (settings) {
    console.log("Updating storeName to 'Raaghas'...");
    await prisma.storeSettings.update({
      where: { id: settings.id },
      data: { storeName: 'Raaghas' }
    });
    console.log("StoreSettings updated.");
  }

  console.log("Fetching current theme...");
  const theme = await prisma.theme.findFirst();
  if (theme) {
    console.log("Updating theme...");
    await prisma.theme.update({
      where: { id: theme.id },
      data: {
        storeName: 'Raaghas',
      }
    });
    console.log("Theme updated.");
  }
}
main().then(() => {
  console.log("Revert complete.");
  process.exit(0);
}).catch(err => {
  console.error("Error reverting:", err);
  process.exit(1);
});
