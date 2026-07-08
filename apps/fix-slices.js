const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!['node_modules', '.git', '.next', 'dist'].includes(f)) walkDir(dirPath, callback);
    } else {
      if (f.endsWith('.ts') || f.endsWith('.tsx')) callback(dirPath);
    }
  });
}

walkDir('/Users/stalinkumar/Documents/Atlas_website/apps', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replacements
  // 1. #{order.id.slice(-8)} => #{order.formattedOrderNumber || order.orderNumber || order.id.slice(-8)}
  content = content.replace(/#\{order\.id\.slice\((-\d+)\)(?:\.toUpperCase\(\))?\}/g, (match, p1) => {
    // If it's already surrounded by fallback, don't replace
    return `#{order.formattedOrderNumber || order.orderNumber || order.id.slice(${p1}).toUpperCase()}`;
  });

  // 2. #{order.id.slice(-8).toUpperCase()} => #{order.formattedOrderNumber || order.orderNumber || order.id.slice(-8).toUpperCase()}
  content = content.replace(/Order #\{order\.id\.slice\((-\d+)\)\}/g, (match, p1) => {
    return `Order #{order.formattedOrderNumber || order.orderNumber || order.id.slice(${p1}).toUpperCase()}`;
  });

  // 3. `#${o.id.slice(-8)}` => `#${o.formattedOrderNumber || o.orderNumber || o.id.slice(-8)}`
  content = content.replace(/#\$\{o\.id\.slice\((-\d+)\)\}/g, (match, p1) => {
    return `#\${o.formattedOrderNumber || o.orderNumber || o.id.slice(${p1})}`;
  });

  // 4. `INV-${order.id.slice(-6).toUpperCase()}` => order.formattedOrderNumber || `INV-${order.id.slice(-6).toUpperCase()}`
  content = content.replace(/\`INV-\$\{order\.id\.slice\((-\d+)\)\.toUpperCase\(\)\}\`/g, (match, p1) => {
    return `(order.formattedOrderNumber || \`INV-\${order.id.slice(${p1}).toUpperCase()}\`)`;
  });

  // 5. #INV-{order.id.slice(-6).toUpperCase()} => #{order.formattedOrderNumber || order.orderNumber || order.id.slice(-6).toUpperCase()}
  content = content.replace(/#INV-\{order\.id\.slice\((-\d+)\)\.toUpperCase\(\)\}/g, (match, p1) => {
    return `#{order.formattedOrderNumber || order.orderNumber || order.id.slice(${p1}).toUpperCase()}`;
  });

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
});
