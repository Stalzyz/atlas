const fs = require('fs');
const path = require('path');

const e2eDir = path.join(__dirname, 'test', 'e2e');
const utilsDir = path.join(__dirname, 'test', 'utils');

const dirs = [e2eDir, utilsDir];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (file.endsWith('.ts')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes("import * as request from 'supertest';")) {
          content = content.replace("import * as request from 'supertest';", "const request = require('supertest');");
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Patched ${file}`);
        }
      }
    });
  }
});
console.log('Done patching supertest imports.');
