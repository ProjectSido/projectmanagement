const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
console.log('📂 Reading .env.local from:', envPath);

let fileContent;
try {
    fileContent = fs.readFileSync(envPath, 'utf8');
} catch (err) {
    console.error('❌ Could not read .env.local:', err.message);
    process.exit(1);
}

// 2. Parse Env Vars
const envVars = {};
fileContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes if any
        envVars[key] = value;
    }
});

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔑 Credentials found:');
console.log('   URL:', url);
console.log('   Key:', key ? `${key.substring(0, 15)}...` : 'MISSING');

if (!url || !key) {
    console.error('❌ Missing URL or Key in .env.local');
    process.exit(1);
}

// 3. Initialize Supabase
console.log('\n🌐 Connecting to Supabase...');
const supabase = createClient(url, key);

// 4. Test Login
async function testLogin() {
    const email = 'john@example.com';
    const password = 'password123';

    console.log(`👤 Attempting login for: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('❌ Login FAILED:', error.message);
        console.error('   Details:', error);
    } else {
        console.log('✅ Login SUCCESS!');
        console.log('   User ID:', data.user.id);
        console.log('   Email:', data.user.email);
    }
}

testLogin();
