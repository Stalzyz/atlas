import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

let envPath = '';
if (fs.existsSync('/var/www/raaghas_new/shared/.env')) {
  envPath = '/var/www/raaghas_new/shared/.env';
} else {
  envPath = path.resolve(__dirname, '../../.env');
}

dotenv.config({ path: envPath });

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'node ./prisma/seed.js',
  },
});
