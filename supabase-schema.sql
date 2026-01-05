-- ============================================
-- SUPABASE DATABASE SCHEMA FOR KANBAN BOARD
-- WITH MULTI-USER SUPPORT
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES TABLE (extends auth.users)
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- BOARDS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.boards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(20) DEFAULT '#6366f1',
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- COLUMNS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.columns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    color VARCHAR(20) DEFAULT '#94a3b8',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- TASKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    column_id UUID NOT NULL REFERENCES public.columns(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    labels TEXT[] DEFAULT '{}',
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- BOARD MEMBERS TABLE (for collaboration)
-- ============================================

CREATE TABLE IF NOT EXISTS public.board_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(board_id, user_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON public.boards(user_id);
CREATE INDEX IF NOT EXISTS idx_columns_board_id ON public.columns(board_id);
CREATE INDEX IF NOT EXISTS idx_columns_position ON public.columns(position);
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON public.tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON public.tasks(position);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_board_members_board_id ON public.board_members(board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user_id ON public.board_members(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view all profiles (for collaboration features)
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================
-- BOARDS POLICIES
-- ============================================

-- Users can view boards they own or are members of
CREATE POLICY "Users can view own boards and shared boards"
ON public.boards FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() 
    OR 
    id IN (SELECT board_id FROM public.board_members WHERE user_id = auth.uid())
);

-- Users can create boards
CREATE POLICY "Users can create boards"
ON public.boards FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own boards
CREATE POLICY "Users can update own boards"
ON public.boards FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own boards
CREATE POLICY "Users can delete own boards"
ON public.boards FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- COLUMNS POLICIES
-- ============================================

-- Users can view columns of boards they have access to
CREATE POLICY "Users can view columns of accessible boards"
ON public.columns FOR SELECT
TO authenticated
USING (
    board_id IN (
        SELECT id FROM public.boards 
        WHERE user_id = auth.uid()
        UNION
        SELECT board_id FROM public.board_members WHERE user_id = auth.uid()
    )
);

-- Users can manage columns of their own boards
CREATE POLICY "Users can insert columns in own boards"
ON public.columns FOR INSERT
TO authenticated
WITH CHECK (
    board_id IN (SELECT id FROM public.boards WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update columns in own boards"
ON public.columns FOR UPDATE
TO authenticated
USING (board_id IN (SELECT id FROM public.boards WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete columns in own boards"
ON public.columns FOR DELETE
TO authenticated
USING (board_id IN (SELECT id FROM public.boards WHERE user_id = auth.uid()));

-- ============================================
-- TASKS POLICIES
-- ============================================

-- Users can view tasks of accessible boards
CREATE POLICY "Users can view tasks of accessible boards"
ON public.tasks FOR SELECT
TO authenticated
USING (
    column_id IN (
        SELECT c.id FROM public.columns c
        JOIN public.boards b ON c.board_id = b.id
        WHERE b.user_id = auth.uid()
        UNION
        SELECT c.id FROM public.columns c
        JOIN public.board_members bm ON c.board_id = bm.board_id
        WHERE bm.user_id = auth.uid()
    )
);

-- Users can manage tasks in their own boards
CREATE POLICY "Users can insert tasks"
ON public.tasks FOR INSERT
TO authenticated
WITH CHECK (
    column_id IN (
        SELECT c.id FROM public.columns c
        JOIN public.boards b ON c.board_id = b.id
        WHERE b.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (
    column_id IN (
        SELECT c.id FROM public.columns c
        JOIN public.boards b ON c.board_id = b.id
        WHERE b.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete tasks"
ON public.tasks FOR DELETE
TO authenticated
USING (
    column_id IN (
        SELECT c.id FROM public.columns c
        JOIN public.boards b ON c.board_id = b.id
        WHERE b.user_id = auth.uid()
    )
);

-- ============================================
-- BOARD MEMBERS POLICIES
-- ============================================

CREATE POLICY "Board owners can manage members"
ON public.board_members FOR ALL
TO authenticated
USING (
    board_id IN (SELECT id FROM public.boards WHERE user_id = auth.uid())
)
WITH CHECK (
    board_id IN (SELECT id FROM public.boards WHERE user_id = auth.uid())
);

CREATE POLICY "Members can view their memberships"
ON public.board_members FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_boards_updated_at ON public.boards;
CREATE TRIGGER update_boards_updated_at
    BEFORE UPDATE ON public.boards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTION: Create board with default columns
-- ============================================

CREATE OR REPLACE FUNCTION create_board_with_columns(
    p_name VARCHAR(255),
    p_description TEXT DEFAULT NULL,
    p_color VARCHAR(20) DEFAULT '#6366f1'
)
RETURNS UUID AS $$
DECLARE
    v_board_id UUID;
BEGIN
    -- Create board
    INSERT INTO public.boards (name, description, color, user_id)
    VALUES (p_name, p_description, p_color, auth.uid())
    RETURNING id INTO v_board_id;
    
    -- Create default columns
    INSERT INTO public.columns (title, board_id, position, color)
    VALUES 
        ('To Do', v_board_id, 0, '#94a3b8'),
        ('In Progress', v_board_id, 1, '#fbbf24'),
        ('Done', v_board_id, 2, '#22c55e');
    
    -- Add owner as board member
    INSERT INTO public.board_members (board_id, user_id, role)
    VALUES (v_board_id, auth.uid(), 'owner');
    
    RETURN v_board_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
