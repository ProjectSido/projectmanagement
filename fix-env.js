const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

const content = `NEXT_PUBLIC_SUPABASE_URL=https://ljelurbozvyhdovzfpwp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqZWx1cmJvenZ5aGRvdnpmcHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NTE3ODAsImV4cCI6MjA4MzAyNzc4MH0.JPcG8Iqn18IAW3gXFxQPenNHTZSw_gkKrUKgpqi_KwQ`;

try {
    fs.writeFileSync(envPath, content, { encoding: 'utf8' });
    console.log('✅ .env.local fixed with UTF-8 encoding!');
} catch (e) {
    console.error('❌ Failed to fix .env.local:', e);
}
