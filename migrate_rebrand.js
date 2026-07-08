const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = [
    'node_modules', '.git', '.next', 'dist', '.turbo', '.system_generated', '.local_npm_cache', '.npm_home', 'coverage', 'build'
];

// Text replacements
const REPLACEMENTS = [
    { old: /api\.atlas\.in/g, new: 'api.grekam.in' },
    { old: /atlas\.in/g, new: 'atlas.grekam.in' },
    { old: /Atlas Heritage/g, new: 'Atlas Heritage' },
    { old: /Atlas Clothing/g, new: 'Atlas Clothing' },
    { old: /Atlas/g, new: 'Atlas' },
    { old: /atlas/g, new: 'atlas' },
    { old: /ATLAS/g, new: 'ATLAS' },
    // localhost replacements
    { old: /http:\/\/localhost:3000/g, new: 'process.env.NEXT_PUBLIC_APP_URL' },
    { old: /http:\/\/localhost:4000/g, new: 'process.env.NEXT_PUBLIC_API_URL' },
    { old: /http:\/\/127\.0\.0\.1:3000/g, new: 'process.env.NEXT_PUBLIC_APP_URL' },
    { old: /http:\/\/127\.0\.0\.1:4000/g, new: 'process.env.NEXT_PUBLIC_API_URL' },
];

let filesModified = 0;
let filesRenamed = 0;
let dirsRenamed = 0;

function walk(dir) {
    let results = [];
    let list;
    try {
        list = fs.readdirSync(dir);
    } catch(e) {
        return results;
    }
    
    // First, process files in the current directory
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
                // If directory name contains 'atlas', rename it first
                if (file.toLowerCase().includes('atlas')) {
                    const newDirName = file.replace(/atlas/g, 'atlas').replace(/Atlas/g, 'Atlas').replace(/ATLAS/g, 'ATLAS');
                    const newDirPath = path.join(dir, newDirName);
                    fs.renameSync(filePath, newDirPath);
                    dirsRenamed++;
                    filePath = newDirPath;
                }
                results = results.concat(walk(filePath));
            }
        } else {
            // File renaming
            let currentFileName = path.basename(filePath);
            if (currentFileName.toLowerCase().includes('atlas')) {
                const newFileName = currentFileName.replace(/atlas/g, 'atlas').replace(/Atlas/g, 'Atlas').replace(/ATLAS/g, 'ATLAS');
                const newFilePath = path.join(dir, newFileName);
                fs.renameSync(filePath, newFilePath);
                filesRenamed++;
                filePath = newFilePath;
            }
            results.push(filePath);
        }
    }
    return results;
}

function processFiles(files) {
    for (const file of files) {
        try {
            const ext = path.extname(file);
            // Only process text files
            if (['.js', '.ts', '.jsx', '.tsx', '.json', '.yml', '.yaml', '.md', '.html', '.css', '.scss', '.sh', '.env', '.example', '.local', '.production', '.development', '.txt', '.sql', '.prisma', '.conf', '.exp'].includes(ext) || file.endsWith('.env') || file.includes('.env')) {
                const content = fs.readFileSync(file, 'utf8');
                let newContent = content;
                
                let modified = false;
                for (const rep of REPLACEMENTS) {
                    if (newContent.match(rep.old)) {
                        newContent = newContent.replace(rep.old, rep.new);
                        modified = true;
                    }
                }
                
                if (modified) {
                    fs.writeFileSync(file, newContent, 'utf8');
                    filesModified++;
                }
            }
        } catch (e) {
            console.error(`Error processing file ${file}:`, e.message);
        }
    }
}

console.log('Starting migration script...');
const allFiles = walk(__dirname);
console.log(`Found ${allFiles.length} files to process.`);
processFiles(allFiles);

console.log('--- Migration Report ---');
console.log(`Files modified: ${filesModified}`);
console.log(`Files renamed: ${filesRenamed}`);
console.log(`Directories renamed: ${dirsRenamed}`);
