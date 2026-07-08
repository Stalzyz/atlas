const fs = require('fs');
const path = require('path');

const replacements = [
  { old: /api\.grekam\.in/g, new: 'atlasatlasapi.grekam.in' },
  { old: /admin\.grekam\.in/g, new: 'atlasatlasadmin.grekam.in' }
];

const ignoredDirs = ['.git', 'node_modules', '.next', '.turbo', '.local_npm_cache'];
const ignoredExts = ['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.mp4', '.dump', '.log', '.ico'];

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoredDirs.includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ignoredExts.includes(ext)) continue;

      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        let original = content;

        for (const rule of replacements) {
          content = content.replace(rule.old, rule.new);
        }

        if (content !== original) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      } catch (err) {
        // Ignore binary file read errors
      }
    }
  }
}

processDirectory(__dirname);
console.log('Migration v2 complete!');
