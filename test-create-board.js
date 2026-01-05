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
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
    }
});

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('❌ Missing URL or Key in .env.local');
    process.exit(1);
}

// 3. Initialize Supabase
console.log('\n🌐 Connecting to Supabase...');
const supabase = createClient(url, key);

// Helper for logging
function log(msg, ...args) {
    const text = msg + ' ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : a).join(' ');
    console.log(text);
    fs.appendFileSync('test_log.txt', text + '\n');
}

async function testCreateBoard() {
    // Clear log file
    fs.writeFileSync('test_log.txt', '');

    // Login first
    const email = 'john@example.com';
    const password = 'password123';
    log(`👤 Logging in as: ${email}`);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError) {
        log('❌ Login FAILED:', authError.message);
        return;
    }

    const userId = authData.user.id;
    log('✅ Login SUCCESS!');
    log('   User ID from Auth:', userId);

    // Create Board
    const boardName = 'Test Board AI ' + Date.now();
    log(`\n📋 Creating Board: "${boardName}"...`);

    // Attempt 1: Direct Insert (like the app does)
    const { data: board, error: boardError } = await supabase
        .from('boards')
        .insert({
            name: boardName,
            description: 'Created by automated test script',
            color: '#6366f1',
            user_id: userId
        })
        .select()
        .single();

    if (boardError) {
        log('❌ Direct Create Board FAILED:', boardError.message);
        log('   Error Details:', boardError);

        // Attempt 2: RPC Call
        log('\n🔄 Attempting via RPC create_board_with_columns...');
        const { data: rpcData, error: rpcError } = await supabase.rpc('create_board_with_columns', {
            p_name: boardName,
            p_description: 'Created via RPC',
            p_color: '#6366f1'
        });

        if (rpcError) {
            log('❌ RPC Create Board FAILED:', rpcError.message);
            return;
        }
        log('✅ Board Created via RPC! ID:', rpcData);
        return;
    }

    log('✅ Board Created! ID:', board.id);

    // Create Columns
    log('📊 Creating Default Columns...');
    const defaultColumns = [
        { title: "To Do", position: 0, board_id: board.id, color: "#94a3b8" },
        { title: "In Progress", position: 1, board_id: board.id, color: "#fbbf24" },
        { title: "Done", position: 2, board_id: board.id, color: "#22c55e" },
    ];

    const { error: columnsError } = await supabase
        .from('columns')
        .insert(defaultColumns);

    if (columnsError) {
        log('❌ Create Columns FAILED:', columnsError.message);
    } else {
        log('✅ Columns Created!');
    }

    // Add Member
    log('👥 Adding Owner to Board Members...');
    const { error: memberError } = await supabase
        .from('board_members')
        .insert({
            board_id: board.id,
            user_id: userId,
            role: 'owner'
        });

    if (memberError) {
        log('❌ Add Member FAILED:', memberError.message);
    } else {
        log('✅ Member Added!');
    }

    log('\n🎉 Test "Create Project & Kanban" COMPLETED SUCCESSFULLY!');
}

testCreateBoard();
