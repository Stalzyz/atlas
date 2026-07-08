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

let modified = 0;
for (const file of allFiles) {
    try {
        const ext = path.extname(file);
        if (['.js', '.ts', '.jsx', '.tsx', '.json', '.yml', '.yaml', '.md', '.html', '.css', '.scss', '.sh', '.env', '.example', '.local', '.production', '.development', '.txt', '.sql', '.prisma', '.conf', '.exp'].includes(ext) || file.includes('.env') || file.includes('nginx.conf')) {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('4401') || content.includes('4402')) {
                const newContent = content.replace(/4401/g, '4401').replace(/4402/g, '4402');
                fs.writeFileSync(file, newContent, 'utf8');
                modified++;
            }
        }
    } catch (e) {}
}

console.log(`Updated ports in ${modified} files.`);
