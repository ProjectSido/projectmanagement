# 🎯 Project Management

A modern, multi-user Kanban board application built with **Next.js 15**, **shadcn/ui**, **Supabase**, and deployed on **Vercel**.

![Kanban Board](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black?)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

## ✨ Features

### 🔐 Authentication & User Management
- **Sign Up** - Register with email and password
- **Sign In** - Secure login with session management
- **User Profiles** - Customizable name and avatar
- **Protected Routes** - Middleware-based authentication

### 📋 Kanban Board
- **Multiple Boards** - Create and manage multiple project boards
- **Customizable Columns** - Add, edit, delete, and color-code columns
- **Task Management** - Create tasks with priorities, due dates, and labels
- **Drag & Drop** - Intuitive drag and drop for task reordering
- **Data Isolation** - Each user sees only their own boards

### 🎨 UI/UX
- **Dark/Light Mode** - Beautiful theme support
- **Responsive Design** - Works on desktop and tablet
- **Modern UI** - Built with shadcn/ui components
- **Real-time Updates** - Powered by Supabase

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or pnpm
- Supabase account (free tier available)
- Vercel account (for deployment)

### 1. Clone and Install

```bash
cd kanban-project
npm install
```

### 2. Setup Supabase Database

**📚 Detailed Guide:** See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for complete step-by-step instructions  
**⚡ Quick Reference:** See [`QUICK_START.md`](./QUICK_START.md) for rapid setup

#### Quick Setup Steps:

1. **Create Project:** Go to [Supabase](https://supabase.com) and create a new project
2. **Run Schema:** Navigate to **SQL Editor** → New Query → Copy & Run `supabase-schema.sql`
3. **Create Test Users:** Go to **Authentication** → **Users** → Add these users:
   - `john@example.com` / `password123`
   - `jane@example.com` / `password123`
   - `bob@example.com` / `password123`
4. **Add Dummy Data:** In **SQL Editor** → New Query → Copy & Run `supabase-dummy-data.sql`
5. **Get Credentials:** Go to **Settings > API** and copy your project URL and anon key

#### What Gets Created:

✅ **3 Sample Boards:**
- Website Redesign Project (with 9 tasks)
- Mobile App Development (with 8 tasks)  
- Marketing Campaign Q1 2024 (with 7 tasks)

✅ **Features Include:**
- Multiple columns per board (To Do, In Progress, Done, etc.)
- Tasks with priorities (low, medium, high, urgent)
- Due dates and label tags
- Board collaboration & member roles

#### Enable Email Auth (Important!)

1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. (Optional) Go to **Authentication > URL Configuration**
4. Set **Site URL** to your deployment URL (e.g., `https://your-app.vercel.app`)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your Kanban board! 🎉

## 📦 Project Structure

```
kanban-project/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout with AuthProvider
│   │   ├── page.tsx          # Root redirect
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── dashboard/        # Main Kanban dashboard
│   │   └── profile/          # User profile settings
│   ├── components/
│   │   ├── kanban/
│   │   │   ├── kanban-board.tsx   # Main board with DnD
│   │   │   ├── kanban-column.tsx  # Column component
│   │   │   ├── task-card.tsx      # Task card component
│   │   │   ├── task-dialog.tsx    # Create/edit task modal
│   │   │   ├── sidebar.tsx        # Sidebar with user & boards
│   │   │   └── index.ts           # Exports
│   │   └── ui/                    # shadcn/ui components
│   ├── lib/
│   │   ├── auth-context.tsx       # Authentication context
│   │   ├── store.ts               # Zustand state management
│   │   ├── utils.ts               # Utility functions
│   │   └── supabase/
│   │       ├── client.ts          # Browser Supabase client
│   │       ├── server.ts          # Server Supabase client
│   │       ├── middleware.ts      # Auth middleware helper
│   │       └── types.ts           # TypeScript types
│   └── middleware.ts              # Next.js auth middleware
├── supabase-schema.sql            # Database schema with RLS
├── package.json
└── README.md
```

## 🗄️ Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `boards` | Project boards owned by users |
| `columns` | Kanban columns in each board |
| `tasks` | Individual tasks with metadata |
| `board_members` | Board collaboration (future) |

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only see/edit their own boards
- Users can only manage columns/tasks in their boards
- Profiles are viewable by all authenticated users

```sql
-- Example: Users can only view their own boards
CREATE POLICY "Users can view own boards"
ON public.boards FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

## 🚢 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**!

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

### Option 3: Automated Deployment with Monitoring

For AI agent automation and deployment monitoring:

```bash
# Use the automated deployment script
.\scripts\deploy-to-vercel.ps1 -Environment "production"

# Or monitor existing deployment
.\scripts\monitor-deployment.ps1
```

**Features:**
- ✅ Pre-deployment checks (git status, branch)
- 🚀 Automated deployment
- 📊 Real-time status monitoring
- 📋 Deployment logs
- 🔍 Health check verification

**Available Commands:**
```bash
# List recent deployments
vercel ls

# View deployment logs
vercel logs

# Inspect deployment details
vercel inspect

# Check environment variables
vercel env ls

# Monitor deployment status
vercel inspect <deployment-url>
```

📖 **Full workflow:** See [.agent/workflows/deploy-vercel.md](./.agent/workflows/deploy-vercel.md)


### Post-Deployment

1. Go to Supabase **Authentication > URL Configuration**
2. Update **Site URL** to your Vercel deployment URL
3. Add the URL to **Redirect URLs** list

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org) | React framework with App Router |
| [shadcn/ui](https://ui.shadcn.com) | Beautifully designed components |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Supabase](https://supabase.com) | PostgreSQL database & auth |
| [Zustand](https://zustand-demo.pmnd.rs) | Lightweight state management |
| [dnd-kit](https://dndkit.com) | Drag and drop library |
| [Lucide Icons](https://lucide.dev) | Beautiful icons |
| [Vercel](https://vercel.com) | Deployment platform |

## 🔒 Security Features

- **Server-side session validation** via middleware
- **Row Level Security** for data isolation
- **Protected API routes** requiring authentication
- **Secure password handling** via Supabase Auth
- **CSRF protection** built into Supabase

## 🎨 Customization

### Change Theme Colors

Edit `src/app/globals.css` to customize the color palette:

```css
:root {
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... more variables */
}
```

### Add New Components

Use shadcn CLI to add more components:

```bash
npx shadcn@latest add [component-name]
```

## 📝 API Routes (Future)

The app is ready for API route additions:

```typescript
// src/app/api/boards/route.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("boards")
    .select("*");
  // ...
}
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ using Next.js, shadcn/ui, and Supabase
