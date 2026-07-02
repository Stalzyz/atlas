const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./apps/admin/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix `${`${API_BASE}/api/v1`}/...` to `${API_BASE}/...`
    content = content.replace(/\$\{`\$\{API_BASE\}\/api\/v1`\}\//g, '${API_BASE}/');
    content = content.replace(/\$\{`\$\{API_BASE\}\/api\/v1`\}/g, '${API_BASE}');

    // Fix const apiBase = `${API_BASE}/api/v1` to const apiBase = API_BASE
    content = content.replace(/const\s+(apiBase|baseUrl|API|API_URL)\s*=\s*`\$\{API_BASE\}\/api\/v1`/g, 'const $1 = API_BASE');
    
    // Fix API_BASE.replace(...) + '/api/v1' to API_BASE
    content = content.replace(/\(API_BASE\)\.replace\(\/\\\\\/api\\\\\/v1\\\\\/\\?\$\/, ''\) \+ '\/api\/v1'/g, 'API_BASE');
    content = content.replace(/\(API_BASE\)\.replace\(\/\\\/api\\\/v1\\\/\?\$\/, ''\) \+ '\/api\/v1'/g, 'API_BASE');
    content = content.replace(/API_BASE\.replace\(\/\\\/api\\\/v1\\\/\?\$\/, ''\) \+ '\/api\/v1'/g, 'API_BASE');
    
    // Check if we missed any `+ '/api/v1'` after API_BASE
    content = content.replace(/API_BASE\s*\+\s*['"`]\/api\/v1['"`]/g, 'API_BASE');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
});
