# XASAN OS Ultimate — Phase 1 (Foundation)

> **Next-Generation Personal Operating System** for Senior Software Architecture, IELTS 8.5 Preparation, Venture Engineering, and Autonomous Execution.

---

## 💎 1. Design System & Theme (Dark Emerald)

The application strictly implements the **Dark Emerald** color palette and glassmorphism hierarchy:

| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| **Primary Background** | `#080D0B` | Deep obsidian main canvas |
| **Secondary Background** | `#101915` | Collapsible sidebar, navigation rails, top panels |
| **Card Background** | `#142019` | Elevated glassmorphism cards (`backdrop-blur-xl`) |
| **Primary Accent** | `#10B981` | Emerald branding, active states, glowing badges |
| **Hover Accent** | `#059669` | High-intent interaction states & primary buttons |
| **Main Text** | `#F3F7F4` | High-contrast typography headers |
| **Secondary Text** | `#98A69D` | Subtitles, metadata, timestamps |
| **Border** | `#25352C` | Subtle structural borders |
| **Error** | `#EF4444` | Urgent alerts & critical notifications |

---

## 🗄️ 2. Database Architecture (Prisma Schema)

Located at [`prisma/schema.prisma`](prisma/schema.prisma), featuring UUID primary keys (`@default(uuid())`), explicit foreign key cascades, timestamps (`createdAt`, `updatedAt`), and user data isolation:

- **`User`**: System owner profile (`id`, `email`, `displayName`, `avatarUrl`, `role`)
- **`Task`**: Execution engine (`id`, `userId`, `projectId`, `title`, `description`, `priority` [LOW, NORMAL, HIGH, URGENT], `status` [PENDING, IN_PROGRESS, COMPLETED], `dueDate`)
- **`Habit` & `HabitLog`**: Discipline tracking with streaks, categories (`HEALTH`, `MIND`, `CODE`), and daily completion logs
- **`Project`**: Developer Hub platforms (`id`, `userId`, `name`, `slug`, `status`, `progress`, `techStack`, `repositoryUrl`, `liveUrl` for *Aurelius IELTS*, *LinguaHub*, *Ravon Avto*)
- **`Transaction`**: Treasury ledger (`id`, `userId`, `title`, `amount`, `type` [INCOME, EXPENSE, TRANSFER], `category`, `account`)
- **`KnowledgeNote`**: Second Brain (`id`, `userId`, `title`, `content`, `category`, `tags`, `isPinned`)
- **`Goal`**: OKR strategic direction tracking

---

## 🖥️ 3. Global App Shell & Navigation Structure

Features the **15 core navigation modules** in a responsive, collapsible sidebar:

1. **Overview** (`/`) — Unified command center & executive telemetry
2. **My Day** (`/my-day`) — Daily protocol & prioritized focus queue
3. **Tasks** (`/tasks`) — Execution pipelines & priority matrix
4. **Calendar** (`/calendar`) — Chronological schedule & milestone deadlines
5. **Life Tracker** (`/life-tracker`) — Discipline rituals & streak tracking
6. **Study Center** (`/study-center`) — Academic IELTS 8.5+ prep & vocabulary
7. **Developer Hub** (`/developer-hub`) — *Aurelius IELTS*, *LinguaHub*, *Ravon Avto*
8. **Finance** (`/finance`) — Treasury ledger, income streams & SaaS burn
9. **XASAN AI** (`/xasan-ai`) — Autonomous reasoning & architecture copilot
10. **Knowledge Base** (`/knowledge-base`) — Architecture memos & technical notes
11. **Goals & Vision** (`/goals`) — Strategic OKRs & life milestones
12. **Analytics** (`/analytics`) — Deep work velocity & discipline curves
13. **Notifications** (`/notifications`) — System alerts & milestone triggers
14. **Profile** (`/profile`) — Architect credentials & system status
15. **Settings** (`/settings`) — Environment config & theme specification

### Integrated Interactive Tools:
- **Global Command Palette**: Instant navigation across all 15 routes via `Ctrl/Cmd + K`
- **Quick-Create Modal**: Unified modal for quick capture of Tasks, Habits, Projects, Transactions, and Notes
- **Navbar System Clock**: Real-time localized telemetry indicator

## 🔒 4. Authentication & Security (Phase 2)

- **Firebase Authentication**: Client SDK initialization in [`src/lib/firebase/client.ts`](src/lib/firebase/client.ts) supporting Google OAuth & Email/Password, with automatic fallback simulation mode for seamless local preview.
- **Protected Routes & Middleware**: [`src/middleware.ts`](src/middleware.ts) inspects session tokens on all dashboard routes and redirects unauthenticated access to [`/login`](src/app/login/page.tsx).
- **User Provisioning & Database Sync**: [`syncFirebaseUserAction`](src/server/actions/auth.ts) provisions users in PostgreSQL via Prisma upon first sign-in, maintaining complete per-user UUID data isolation.
- **App Passcode / PIN Lock**: [`/lock`](src/app/lock/page.tsx) screen supporting 4-digit or 6-digit numeric passcodes (default `1234`), biometric simulation (TouchID / FaceID), and a 3-attempt lockout mechanism (30-second penalty countdown).
- **Profile & Security Controls**: Enhanced [`/profile`](src/app/profile/page.tsx) with identity bio, PIN configuration, active recognized session manager, and secure logout.

---

## 🚀 Quickstart Commands

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma ORM client
npm run prisma:generate

# 3. Apply schema to PostgreSQL database (when database is connected)
npm run prisma:push

# 4. Seed database with foundation data
npm run db:seed

# 5. Launch development server
npm run dev
```
