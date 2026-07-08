const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = [
    'node_modules', '.git', '.next', 'dist', '.turbo', '.system_generated', '.local_npm_cache', '.npm_home', 'coverage', 'build'
];

function walk(dir) {
    let results = [];
    let list;
    try {
        list = fs.readdirSync(dir);
    } catch(e) {
        return results;
    }
    
    for (const file of list) {
        let filePath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(filePath);
        } catch(e) {
            continue;
        }
        
        if (stat && stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                results = results.concat(walk(filePath));
            }
        } else {
            results.push(filePath);
        }
    }
    return results;
}

const allFiles = walk(__dirname);

for (const file of allFiles) {
    if (file.includes('.env')) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('atlas_user:Atlas%40Prod2024@localhost:5432/atlas')) {
            content = content.replace(/atlas_user:Atlas%40Prod2024@localhost:5432\/atlas/g, 'raaghas_user:Raaghas%40Prod2024@localhost:5432/raaghas');
            fs.writeFileSync(file, content, 'utf8');
            console.log('Reverted in', file);
        }
    }
}
