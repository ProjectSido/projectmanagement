const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

// Data yang bersih
const url = "https://ljelurbozvyhdovzfpwp.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqZWx1cmJvenZ5aGRvdnpmcHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NTE3ODAsImV4cCI6MjA4MzAyNzc4MH0.JPcG8Iqn18IAW3gXFxQPenNHTZSw_gkKrUKgpqi_KwQ";

const content = `NEXT_PUBLIC_SUPABASE_URL=${url}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${key}`;

try {
    fs.writeFileSync(envPath, content, { encoding: 'utf8' });
    console.log('✅ .env.local written successfully!');
    console.log('URL:', url);
    console.log('Key Length:', key.length);
} catch (e) {
    console.error('❌ Failed:', e);
}
