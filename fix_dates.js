const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'apps'));
let modified = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace .toLocaleDateString() with .toLocaleDateString('en-GB')
  content = content.replace(/\.toLocaleDateString\(\)/g, ".toLocaleDateString('en-GB')");
  // Replace .toLocaleDateString('en-US') with .toLocaleDateString('en-GB')
  content = content.replace(/\.toLocaleDateString\(['"]en-(US|IN)['"]/g, ".toLocaleDateString('en-GB'");
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    modified++;
    console.log('Updated', file);
  }
});

console.log(`Updated ${modified} files.`);
