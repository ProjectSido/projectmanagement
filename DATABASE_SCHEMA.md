# 📊 Database Schema Overview

Visual representation dari struktur database Kanban Board.

---

## 🏗️ Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE DATABASE SCHEMA                             │
│                            Kanban Board System                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   auth.users         │ (Supabase Auth)
│──────────────────────│
│ • id (UUID) PK       │
│ • email              │
│ • encrypted_password │
│ • created_at         │
└──────────────────────┘
          │
          │ 1:1
          ▼
┌──────────────────────┐
│   profiles           │ (User Profiles)
│──────────────────────│
│ • id (UUID) PK, FK   │──────────────┐
│ • email              │              │
│ • full_name          │              │
│ • avatar_url         │              │
│ • created_at         │              │ 1:N
│ • updated_at         │              │
└──────────────────────┘              │
          │                           │
          │ 1:N (owner)               │
          ▼                           │
┌──────────────────────┐              │
│   boards             │ (Project Boards)
│──────────────────────│              │
│ • id (UUID) PK       │◄─────────────┘
│ • name               │              │
│ • description        │              │
│ • color              │              │ 1:N
│ • user_id FK         │              │
│ • created_at         │              │
│ • updated_at         │              │
└──────────────────────┘              │
          │                           │
          │ 1:N                       │
          ▼                           │
┌──────────────────────┐              │
│   columns            │ (Kanban Columns)
│──────────────────────│              │
│ • id (UUID) PK       │              │
│ • title              │              │
│ • board_id FK        │              │
│ • position (int)     │              │
│ • color              │              │ 1:N
│ • created_at         │              │
└──────────────────────┘              │
          │                           │
          │ 1:N                       │
          ▼                           │
┌──────────────────────┐              │
│   tasks              │ (Task Cards) │
│──────────────────────│              │
│ • id (UUID) PK       │              │
│ • title              │              │
│ • description        │              │
│ • column_id FK       │              │
│ • position (int)     │              │
│ • priority           │              │
│ • due_date           │              │
│ • labels (array)     │              │
│ • assigned_to FK     │──────────────┘
│ • created_at         │
│ • updated_at         │
└──────────────────────┘

┌──────────────────────┐
│   board_members      │ (Collaboration)
│──────────────────────│
│ • id (UUID) PK       │
│ • board_id FK        │───────► boards.id
│ • user_id FK         │───────► profiles.id
│ • role (enum)        │ (owner, admin, member, viewer)
│ • created_at         │
│                      │
│ UNIQUE(board_id, user_id)
└──────────────────────┘
```

---

## 📋 Table Details

### 1. **profiles** (User Profiles)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, FK → auth.users | User UUID from Supabase Auth |
| `email` | VARCHAR(255) | NOT NULL | User email address |
| `full_name` | VARCHAR(255) | - | Display name |
| `avatar_url` | TEXT | - | Profile picture URL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Account creation time |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update time |

**Indexes:**
- `idx_profiles_email` on `email`

**RLS Policies:**
- ✅ All authenticated users can view profiles
- ✅ Users can only update their own profile
- ✅ Auto-created on user signup via trigger

---

### 2. **boards** (Project Boards)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Board unique ID |
| `name` | VARCHAR(255) | NOT NULL | Board name |
| `description` | TEXT | - | Board description |
| `color` | VARCHAR(20) | DEFAULT '#6366f1' | Theme color (hex) |
| `user_id` | UUID | FK → profiles.id, NOT NULL | Board owner |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation time |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update |

**Indexes:**
- `idx_boards_user_id` on `user_id`

**RLS Policies:**
- ✅ Users can view own boards + shared boards
- ✅ Users can create boards
- ✅ Users can update/delete own boards
- 🔒 Cascade delete: deletes all columns & tasks

---

### 3. **columns** (Kanban Columns)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Column unique ID |
| `title` | VARCHAR(255) | NOT NULL | Column name (e.g., "To Do") |
| `board_id` | UUID | FK → boards.id, NOT NULL | Parent board |
| `position` | INTEGER | NOT NULL, DEFAULT 0 | Display order |
| `color` | VARCHAR(20) | DEFAULT '#94a3b8' | Column color (hex) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation time |

**Indexes:**
- `idx_columns_board_id` on `board_id`
- `idx_columns_position` on `position`

**RLS Policies:**
- ✅ Users can view columns of accessible boards
- ✅ Board owners can manage columns
- 🔒 Cascade delete: deletes all tasks in column

---

### 4. **tasks** (Task Cards)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Task unique ID |
| `title` | VARCHAR(255) | NOT NULL | Task title |
| `description` | TEXT | - | Task details |
| `column_id` | UUID | FK → columns.id, NOT NULL | Parent column |
| `position` | INTEGER | NOT NULL, DEFAULT 0 | Order in column |
| `priority` | VARCHAR(20) | CHECK, DEFAULT 'medium' | low/medium/high/urgent |
| `due_date` | TIMESTAMPTZ | - | Optional deadline |
| `labels` | TEXT[] | DEFAULT '{}' | Array of tags |
| `assigned_to` | UUID | FK → profiles.id | Assigned user |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation time |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update |

**Indexes:**
- `idx_tasks_column_id` on `column_id`
- `idx_tasks_position` on `position`
- `idx_tasks_assigned_to` on `assigned_to`

**RLS Policies:**
- ✅ Users can view tasks of accessible boards
- ✅ Board owners can manage tasks
- 🎯 Tasks can be assigned to any user

**Priority Values:**
```
'low'     → 🟢 Green
'medium'  → 🟡 Yellow
'high'    → 🟠 Orange
'urgent'  → 🔴 Red
```

---

### 5. **board_members** (Collaboration)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Membership ID |
| `board_id` | UUID | FK → boards.id, NOT NULL | Board reference |
| `user_id` | UUID | FK → profiles.id, NOT NULL | User reference |
| `role` | VARCHAR(20) | CHECK, DEFAULT 'member' | Access level |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Added time |

**Constraints:**
- `UNIQUE(board_id, user_id)` - Satu user hanya bisa punya 1 role per board

**Indexes:**
- `idx_board_members_board_id` on `board_id`
- `idx_board_members_user_id` on `user_id`

**RLS Policies:**
- ✅ Board owners can manage members
- ✅ Members can view their memberships

**Role Types:**
```
'owner'   → Full control, can delete board
'admin'   → Can manage members & content
'member'  → Can edit tasks & columns
'viewer'  → Read-only access
```

---

## 🔐 Row Level Security (RLS)

**All tables have RLS enabled!** Ini memastikan:

1. **Data Isolation** - Users hanya bisa akses data mereka sendiri
2. **Secure by Default** - Bahkan dengan API key, access tetap terbatas
3. **Multi-tenancy** - Support multiple users dengan aman

### Example Policies:

```sql
-- Users can only view their own boards
CREATE POLICY "Users can view own boards"
ON public.boards FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() 
    OR 
    id IN (SELECT board_id FROM board_members WHERE user_id = auth.uid())
);
```

---

## ⚡ Triggers & Functions

### 1. **Auto-create Profile on Signup**

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Function:** `handle_new_user()`
- Automatically creates profile when user signs up
- Extracts name from metadata or email
- Copies avatar URL if provided

### 2. **Auto-update Timestamps**

```sql
CREATE TRIGGER update_boards_updated_at
    BEFORE UPDATE ON boards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Apply to:** `profiles`, `boards`, `tasks`
- Automatically sets `updated_at = NOW()` on every update

### 3. **Helper: Create Board with Default Columns**

```sql
SELECT create_board_with_columns(
    'My New Board',
    'Board description',
    '#6366f1'
);
```

**Function:** `create_board_with_columns(name, description, color)`
- Creates board
- Adds default columns: "To Do", "In Progress", "Done"
- Adds creator as board owner
- Returns board UUID

---

## 📊 Data Flow

### Creating a New Task:

```
1. User creates task in UI
2. Frontend: supabase.from('tasks').insert({...})
3. RLS checks: Is column_id in user's accessible boards?
4. If yes: Insert task
5. If no: Error 403 - Forbidden
6. Trigger: Set created_at, updated_at
7. Frontend: Update local state
8. UI: Show new task card
```

### Moving Task Between Columns:

```
1. User drags task to new column
2. Frontend: Update position + column_id
3. RLS checks: Both columns in user's boards?
4. Update task.column_id and task.position
5. Trigger: Update task.updated_at
6. Frontend: Optimistic UI update
7. UI: Task appears in new column
```

---

## 🔍 Common Queries

### Get all boards with task counts:

```sql
SELECT 
    b.*,
    COUNT(DISTINCT c.id) as column_count,
    COUNT(t.id) as task_count
FROM boards b
LEFT JOIN columns c ON b.id = c.board_id
LEFT JOIN tasks t ON c.id = t.column_id
WHERE b.user_id = auth.uid()
GROUP BY b.id
ORDER BY b.updated_at DESC;
```

### Get board with columns and tasks:

```sql
SELECT 
    b.id as board_id,
    b.name as board_name,
    c.id as column_id,
    c.title as column_title,
    c.position as column_position,
    json_agg(
        json_build_object(
            'id', t.id,
            'title', t.title,
            'priority', t.priority,
            'position', t.position
        ) ORDER BY t.position
    ) as tasks
FROM boards b
JOIN columns c ON b.id = c.board_id
LEFT JOIN tasks t ON c.id = t.column_id
WHERE b.id = $1
GROUP BY b.id, b.name, c.id, c.title, c.position
ORDER BY c.position;
```

### Get user's overdue tasks:

```sql
SELECT 
    t.*,
    c.title as column,
    b.name as board
FROM tasks t
JOIN columns c ON t.column_id = c.id
JOIN boards b ON c.board_id = b.id
WHERE 
    b.user_id = auth.uid() 
    AND t.due_date < NOW()
    AND t.due_date IS NOT NULL
ORDER BY t.due_date ASC;
```

---

## 🎯 Best Practices

### 1. **Always use RLS**
- Never expose direct database credentials
- Use `anon` key for client-side access
- Let RLS handle authorization

### 2. **Use Indexes**
- All foreign keys are indexed
- Position columns are indexed for sorting
- Add more indexes if queries are slow

### 3. **Cascade Deletes**
- Deleting board → auto-deletes columns → auto-deletes tasks
- Prevents orphaned records
- Maintains referential integrity

### 4. **Optimize Position Updates**
- When reordering, update only affected items
- Use batch updates for multiple items
- Consider using `position = position + 1` for shifts

### 5. **Timestamps**
- Use `created_at` for auditing
- Use `updated_at` for cache invalidation
- Timestamps auto-update via triggers

---

**📚 Related Files:**
- [`supabase-schema.sql`](./supabase-schema.sql) - Full schema DDL
- [`supabase-dummy-data.sql`](./supabase-dummy-data.sql) - Sample data
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) - Setup guide
- [`QUICK_START.md`](./QUICK_START.md) - Quick reference
