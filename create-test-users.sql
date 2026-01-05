-- ============================================
-- CREATE TEST USERS FOR KANBAN BOARD
-- ============================================
-- Script ini membuat test users langsung di database
-- Jalankan ini SEBELUM menjalankan supabase-dummy-data.sql
-- ============================================

-- ⚠️ CATATAN PENTING:
-- Password akan di-hash menggunakan bcrypt
-- Password asli: password123
-- ============================================

-- User 1: John Doe
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'john@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"John Doe"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'john@example.com'
);

-- User 2: Jane Smith
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'jane@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Jane Smith"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'jane@example.com'
);

-- User 3: Bob Wilson
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'bob@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Bob Wilson"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'bob@example.com'
);

-- ============================================
-- VERIFIKASI: Cek users yang baru dibuat
-- ============================================

DO $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count 
    FROM auth.users 
    WHERE email IN ('john@example.com', 'jane@example.com', 'bob@example.com');
    
    RAISE NOTICE '✅ Successfully created/found % test user(s)', user_count;
    RAISE NOTICE '📧 Users:';
    RAISE NOTICE '   - john@example.com / password123';
    RAISE NOTICE '   - jane@example.com / password123';
    RAISE NOTICE '   - bob@example.com / password123';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next Step: Jalankan supabase-dummy-data.sql';
END $$;

-- Tampilkan daftar users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email IN ('john@example.com', 'jane@example.com', 'bob@example.com')
ORDER BY email;
