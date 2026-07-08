const fs = require('fs');
const path = require('path');

const replacements = [
  { old: /api\.atlas\.in/g, new: 'api.grekam.in' },
  { old: /admin\.atlas\.in/g, new: 'admin.grekam.in' },
  { old: /www\.atlas\.in/g, new: 'www.atlas.grekam.in' },
  { old: /admin@atlas\.in/g, new: 'admin@grekam.in' },
  { old: /support@atlas\.in/g, new: 'support@grekam.in' },
  { old: /wholesale@atlas\.in/g, new: 'wholesale@grekam.in' },
  { old: /notifications@atlas\.in/g, new: 'notifications@grekam.in' },
  { old: /love@atlas\.in/g, new: 'love@grekam.in' },
  { old: /atlas\.in/g, new: 'atlas.grekam.in' }
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
        // Ignore read errors for binary files that slip through
      }
    }
  }
}

processDirectory(__dirname);
console.log('Migration complete!');
