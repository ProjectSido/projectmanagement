-- ============================================
-- DUMMY DATA FOR KANBAN BOARD
-- ============================================
-- ⚠️ IMPORTANT: You MUST create test users BEFORE running this script!
-- 
-- PREREQUISITES:
-- 1. Schema must be created (run supabase-schema.sql first)
-- 2. Test users must be created
--
-- 🚀 CARA TERCEPAT:
-- Jalankan file: create-test-users.sql TERLEBIH DAHULU
-- 
-- Atau buat manual di: Authentication > Users
--    - john@example.com / password123
--    - jane@example.com / password123
--    - bob@example.com / password123
--
-- ⚠️ Jika users belum ada, script ini akan ERROR!
-- ============================================

-- ============================================
-- VALIDATION: Check if users exist
-- ============================================

DO $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count 
    FROM auth.users 
    WHERE email IN ('john@example.com', 'jane@example.com', 'bob@example.com');
    
    IF user_count = 0 THEN
        RAISE NOTICE '⚠️  WARNING: No test users found!';
        RAISE NOTICE '📝 Please create users first:';
        RAISE NOTICE '   1. Run create-test-users.sql in SQL Editor';
        RAISE NOTICE '   2. Or create manually in Authentication > Users';
        RAISE NOTICE '   3. Then run this script again';
        RAISE EXCEPTION 'Test users not found. Please create users first.' USING HINT = 'Run create-test-users.sql first';
    ELSE
        RAISE NOTICE '✅ Found % test user(s)', user_count;
        RAISE NOTICE '📊 Proceeding with dummy data insertion...';
    END IF;
END $$;

-- ============================================
-- STEP 1: Insert Sample Boards
-- ============================================

-- Board 1: Website Redesign Project
INSERT INTO public.boards (id, name, description, color, user_id, created_at)
SELECT
    '11111111-1111-1111-1111-111111111111',
    'Website Redesign Project',
    'Complete redesign of company website with modern UI/UX',
    '#6366f1',
    u.id,
    NOW() - INTERVAL '7 days'
FROM auth.users u
WHERE u.email = 'john@example.com'
ON CONFLICT (id) DO NOTHING;

-- Board 2: Mobile App Development
INSERT INTO public.boards (id, name, description, color, user_id, created_at)
SELECT
    '22222222-2222-2222-2222-222222222222',
    'Mobile App Development',
    'New mobile app for iOS and Android platforms',
    '#ec4899',
    u.id,
    NOW() - INTERVAL '5 days'
FROM auth.users u
WHERE u.email = 'jane@example.com'
ON CONFLICT (id) DO NOTHING;

-- Board 3: Marketing Campaign Q1 2024
INSERT INTO public.boards (id, name, description, color, user_id, created_at)
SELECT
    '33333333-3333-3333-3333-333333333333',
    'Marketing Campaign Q1 2024',
    'Digital marketing campaign for product launch',
    '#10b981',
    u.id,
    NOW() - INTERVAL '3 days'
FROM auth.users u
WHERE u.email = 'john@example.com'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 4: Insert Columns for Each Board
-- ============================================

-- Columns for Board 1: Website Redesign
INSERT INTO public.columns (id, title, board_id, position, color) VALUES
('c1111111-1111-1111-1111-111111111111', 'Backlog', '11111111-1111-1111-1111-111111111111', 0, '#94a3b8'),
('c1111111-1111-1111-1111-111111111112', 'To Do', '11111111-1111-1111-1111-111111111111', 1, '#3b82f6'),
('c1111111-1111-1111-1111-111111111113', 'In Progress', '11111111-1111-1111-1111-111111111111', 2, '#fbbf24'),
('c1111111-1111-1111-1111-111111111114', 'Review', '11111111-1111-1111-1111-111111111111', 3, '#f59e0b'),
('c1111111-1111-1111-1111-111111111115', 'Done', '11111111-1111-1111-1111-111111111111', 4, '#22c55e')
ON CONFLICT (id) DO NOTHING;

-- Columns for Board 2: Mobile App
INSERT INTO public.columns (id, title, board_id, position, color) VALUES
('c2222222-2222-2222-2222-222222222221', 'To Do', '22222222-2222-2222-2222-222222222222', 0, '#94a3b8'),
('c2222222-2222-2222-2222-222222222222', 'In Progress', '22222222-2222-2222-2222-222222222222', 1, '#fbbf24'),
('c2222222-2222-2222-2222-222222222223', 'Testing', '22222222-2222-2222-2222-222222222222', 2, '#8b5cf6'),
('c2222222-2222-2222-2222-222222222224', 'Done', '22222222-2222-2222-2222-222222222222', 3, '#22c55e')
ON CONFLICT (id) DO NOTHING;

-- Columns for Board 3: Marketing Campaign
INSERT INTO public.columns (id, title, board_id, position, color) VALUES
('c3333333-3333-3333-3333-333333333331', 'Ideas', '33333333-3333-3333-3333-333333333333', 0, '#a855f7'),
('c3333333-3333-3333-3333-333333333332', 'Planning', '33333333-3333-3333-3333-333333333333', 1, '#3b82f6'),
('c3333333-3333-3333-3333-333333333333', 'Execution', '33333333-3333-3333-3333-333333333333', 2, '#ef4444'),
('c3333333-3333-3333-3333-333333333334', 'Completed', '33333333-3333-3333-3333-333333333333', 3, '#22c55e')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 5: Insert Sample Tasks
-- ============================================

-- Tasks for Board 1: Website Redesign - Backlog
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a1111111-1111-1111-1111-111111111111', 
 'Research competitor websites', 
 'Analyze top 10 competitor websites for design inspiration and best practices',
 'c1111111-1111-1111-1111-111111111111', 
 0, 
 'medium', 
 NOW() + INTERVAL '14 days',
 ARRAY['research', 'design']),
('a1111111-1111-1111-1111-111111111112', 
 'Create user personas', 
 'Develop detailed user personas based on analytics data',
 'c1111111-1111-1111-1111-111111111111', 
 1, 
 'high', 
 NOW() + INTERVAL '10 days',
 ARRAY['ux', 'research'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 1: Website Redesign - To Do
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a1111111-1111-1111-1111-111111111121', 
 'Design homepage mockup', 
 'Create high-fidelity mockup for the new homepage in Figma',
 'c1111111-1111-1111-1111-111111111112', 
 0, 
 'high', 
 NOW() + INTERVAL '7 days',
 ARRAY['design', 'figma', 'homepage']),
('a1111111-1111-1111-1111-111111111122', 
 'Setup color palette', 
 'Define primary, secondary, and accent colors for the brand',
 'c1111111-1111-1111-1111-111111111112', 
 1, 
 'medium', 
 NOW() + INTERVAL '5 days',
 ARRAY['design', 'branding']),
('a1111111-1111-1111-1111-111111111123', 
 'Choose typography', 
 'Select and test font families for headings and body text',
 'c1111111-1111-1111-1111-111111111112', 
 2, 
 'medium', 
 NOW() + INTERVAL '5 days',
 ARRAY['design', 'typography'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 1: Website Redesign - In Progress
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a1111111-1111-1111-1111-111111111131', 
 'Develop navigation component', 
 'Build responsive navigation with mobile menu',
 'c1111111-1111-1111-1111-111111111113', 
 0, 
 'urgent', 
 NOW() + INTERVAL '3 days',
 ARRAY['development', 'frontend', 'react']),
('a1111111-1111-1111-1111-111111111132', 
 'Implement hero section', 
 'Code the hero section with animations and CTA buttons',
 'c1111111-1111-1111-1111-111111111113', 
 1, 
 'high', 
 NOW() + INTERVAL '4 days',
 ARRAY['development', 'frontend'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 1: Website Redesign - Review
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a1111111-1111-1111-1111-111111111141', 
 'Footer component review', 
 'Review footer design and functionality across all pages',
 'c1111111-1111-1111-1111-111111111114', 
 0, 
 'medium', 
 NOW() + INTERVAL '2 days',
 ARRAY['review', 'qa'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 1: Website Redesign - Done
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a1111111-1111-1111-1111-111111111151', 
 'Setup project repository', 
 'Initialize Git repo and setup Next.js project structure',
 'c1111111-1111-1111-1111-111111111115', 
 0, 
 'high', 
 NOW() - INTERVAL '5 days',
 ARRAY['setup', 'infrastructure']),
('a1111111-1111-1111-1111-111111111152', 
 'Configure Tailwind CSS', 
 'Install and configure Tailwind with custom theme',
 'c1111111-1111-1111-1111-111111111115', 
 1, 
 'medium', 
 NOW() - INTERVAL '4 days',
 ARRAY['setup', 'css'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 2: Mobile App - To Do
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a2222222-2222-2222-2222-222222222221', 
 'Design onboarding screens', 
 'Create wireframes and mockups for user onboarding flow',
 'c2222222-2222-2222-2222-222222222221', 
 0, 
 'high', 
 NOW() + INTERVAL '8 days',
 ARRAY['design', 'mobile', 'ux']),
('a2222222-2222-2222-2222-222222222222', 
 'Setup Firebase', 
 'Configure Firebase for authentication and database',
 'c2222222-2222-2222-2222-222222222221', 
 1, 
 'high', 
 NOW() + INTERVAL '6 days',
 ARRAY['backend', 'firebase', 'setup']),
('a2222222-2222-2222-2222-222222222223', 
 'API integration plan', 
 'Document all API endpoints and integration methods',
 'c2222222-2222-2222-2222-222222222221', 
 2, 
 'medium', 
 NOW() + INTERVAL '9 days',
 ARRAY['api', 'documentation'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 2: Mobile App - In Progress
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a2222222-2222-2222-2222-222222222231', 
 'Login screen development', 
 'Build login screen with email and social auth options',
 'c2222222-2222-2222-2222-222222222222', 
 0, 
 'urgent', 
 NOW() + INTERVAL '2 days',
 ARRAY['development', 'authentication']),
('a2222222-2222-2222-2222-222222222232', 
 'User profile screen', 
 'Create user profile with edit capabilities',
 'c2222222-2222-2222-2222-222222222222', 
 1, 
 'high', 
 NOW() + INTERVAL '5 days',
 ARRAY['development', 'frontend'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 2: Mobile App - Testing
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a2222222-2222-2222-2222-222222222241', 
 'Test splash screen', 
 'Verify splash screen loads correctly on iOS and Android',
 'c2222222-2222-2222-2222-222222222223', 
 0, 
 'medium', 
 NOW() + INTERVAL '3 days',
 ARRAY['testing', 'qa'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 2: Mobile App - Done
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a2222222-2222-2222-2222-222222222251', 
 'Project setup', 
 'Initialize React Native project with required dependencies',
 'c2222222-2222-2222-2222-222222222224', 
 0, 
 'high', 
 NOW() - INTERVAL '3 days',
 ARRAY['setup', 'react-native'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 3: Marketing Campaign - Ideas
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a3333333-3333-3333-3333-333333333331', 
 'Social media contest', 
 'Run a giveaway contest on Instagram and Facebook',
 'c3333333-3333-3333-3333-333333333331', 
 0, 
 'low', 
 NOW() + INTERVAL '20 days',
 ARRAY['social-media', 'marketing']),
('a3333333-3333-3333-3333-333333333332', 
 'Influencer partnerships', 
 'Reach out to micro-influencers in our niche',
 'c3333333-3333-3333-3333-333333333331', 
 1, 
 'medium', 
 NOW() + INTERVAL '15 days',
 ARRAY['influencer', 'partnerships'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 3: Marketing Campaign - Planning
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a3333333-3333-3333-3333-333333333341', 
 'Email campaign strategy', 
 'Plan email sequence for product launch announcement',
 'c3333333-3333-3333-3333-333333333332', 
 0, 
 'high', 
 NOW() + INTERVAL '7 days',
 ARRAY['email', 'strategy']),
('a3333333-3333-3333-3333-333333333342', 
 'Content calendar', 
 'Create 30-day content calendar for all platforms',
 'c3333333-3333-3333-3333-333333333332', 
 1, 
 'high', 
 NOW() + INTERVAL '5 days',
 ARRAY['content', 'planning'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 3: Marketing Campaign - Execution
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a3333333-3333-3333-3333-333333333351', 
 'Design ad creatives', 
 'Create banner ads for Google Ads and Facebook Ads',
 'c3333333-3333-3333-3333-333333333333', 
 0, 
 'urgent', 
 NOW() + INTERVAL '2 days',
 ARRAY['design', 'ads']),
('a3333333-3333-3333-3333-333333333352', 
 'Launch landing page', 
 'Deploy optimized landing page for campaign',
 'c3333333-3333-3333-3333-333333333333', 
 1, 
 'urgent', 
 NOW() + INTERVAL '3 days',
 ARRAY['web', 'development'])
ON CONFLICT (id) DO NOTHING;

-- Tasks for Board 3: Marketing Campaign - Completed
INSERT INTO public.tasks (id, title, description, column_id, position, priority, due_date, labels) VALUES
('a3333333-3333-3333-3333-333333333361', 
 'Market research', 
 'Comprehensive market analysis and competitor research',
 'c3333333-3333-3333-3333-333333333334', 
 0, 
 'high', 
 NOW() - INTERVAL '2 days',
 ARRAY['research', 'analysis'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 6: Insert Board Members (Collaboration)
-- ============================================

-- Add members to Website Redesign Project
INSERT INTO public.board_members (board_id, user_id, role)
SELECT '11111111-1111-1111-1111-111111111111', u.id, 'owner'
FROM auth.users u WHERE u.email = 'john@example.com'
ON CONFLICT (board_id, user_id) DO NOTHING;

INSERT INTO public.board_members (board_id, user_id, role)
SELECT '11111111-1111-1111-1111-111111111111', u.id, 'admin'
FROM auth.users u WHERE u.email = 'jane@example.com'
ON CONFLICT (board_id, user_id) DO NOTHING;

INSERT INTO public.board_members (board_id, user_id, role)
SELECT '11111111-1111-1111-1111-111111111111', u.id, 'member'
FROM auth.users u WHERE u.email = 'bob@example.com'
ON CONFLICT (board_id, user_id) DO NOTHING;

-- Add members to Mobile App Development
INSERT INTO public.board_members (board_id, user_id, role)
SELECT '22222222-2222-2222-2222-222222222222', u.id, 'owner'
FROM auth.users u WHERE u.email = 'jane@example.com'
ON CONFLICT (board_id, user_id) DO NOTHING;

INSERT INTO public.board_members (board_id, user_id, role)
SELECT '22222222-2222-2222-2222-222222222222', u.id, 'member'
FROM auth.users u WHERE u.email = 'bob@example.com'
ON CONFLICT (board_id, user_id) DO NOTHING;

-- Add members to Marketing Campaign
INSERT INTO public.board_members (board_id, user_id, role)
SELECT '33333333-3333-3333-3333-333333333333', u.id, 'owner'
FROM auth.users u WHERE u.email = 'john@example.com'
ON CONFLICT (board_id, user_id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after inserting data to verify:

-- Check all boards
-- SELECT b.name, p.email as owner_email, b.created_at 
-- FROM public.boards b 
-- JOIN public.profiles p ON b.user_id = p.id 
-- ORDER BY b.created_at DESC;

-- Check columns per board
-- SELECT b.name as board, c.title as column, c.position 
-- FROM public.columns c 
-- JOIN public.boards b ON c.board_id = b.id 
-- ORDER BY b.name, c.position;

-- Check tasks count per column
-- SELECT b.name as board, c.title as column, COUNT(t.id) as task_count 
-- FROM public.columns c 
-- LEFT JOIN public.tasks t ON c.id = t.column_id 
-- JOIN public.boards b ON c.board_id = b.id 
-- GROUP BY b.name, c.title, c.position 
-- ORDER BY b.name, c.position;

-- Check board members
-- SELECT b.name as board, p.email as member, bm.role 
-- FROM public.board_members bm 
-- JOIN public.boards b ON bm.board_id = b.id 
-- JOIN public.profiles p ON bm.user_id = p.id 
-- ORDER BY b.name, bm.role;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ========================================';
    RAISE NOTICE '✅ DUMMY DATA BERHASIL DIINSERT!';
    RAISE NOTICE '🎉 ========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Data yang dibuat:';
    RAISE NOTICE '   - 3 Boards';
    RAISE NOTICE '   - 13 Columns';
    RAISE NOTICE '   - 24 Tasks';
    RAISE NOTICE '   - 6 Board Memberships';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 Login dengan:';
    RAISE NOTICE '   Email: john@example.com';
    RAISE NOTICE '   Password: password123';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Selamat mencoba!';
    RAISE NOTICE '';
END $$;
