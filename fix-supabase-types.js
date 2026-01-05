const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'store.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all Supabase operations that cause type issues
content = content.replace(/await supabase\.rpc\(/g, 'await (supabase as any).rpc(');
content = content.replace(/await supabase\s*\n\s*\.from\(/g, 'await (supabase as any)\n            .from(');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Supabase type issues in store.ts');
