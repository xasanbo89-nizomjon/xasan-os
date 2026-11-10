export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgeType?: "emerald" | "warning" | "urgent" | "neutral";
  section: "Core" | "Growth & Focus" | "Intelligence" | "System";
  description: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // 1-4: Core
  {
    id: "overview",
    name: "Overview",
    href: "/",
    icon: "LayoutDashboard",
    section: "Core",
    description: "Executive control room & unified system metrics",
  },
  {
    id: "my-day",
    name: "My Day",
    href: "/my-day",
    icon: "Sun",
    badge: "Active",
    badgeType: "emerald",
    section: "Core",
    description: "Daily agenda, prioritized queue & morning protocol",
  },
  {
    id: "tasks",
    name: "Tasks",
    href: "/tasks",
    icon: "CheckSquare",
    badge: "8",
    badgeType: "neutral",
    section: "Core",
    description: "Granular execution, priorities, and workflow pipelines",
  },
  {
    id: "calendar",
    name: "Calendar",
    href: "/calendar",
    icon: "Calendar",
    section: "Core",
    description: "Time-blocked schedules and upcoming milestone deadlines",
  },

  // 5-8: Growth & Focus
  {
    id: "life-tracker",
    name: "Life Tracker",
    href: "/life-tracker",
    icon: "Flame",
    badge: "5 Streaks",
    badgeType: "emerald",
    section: "Growth & Focus",
    description: "Daily discipline, habits, workout and health metrics",
  },
  {
    id: "study-center",
    name: "Study Center",
    href: "/study-center",
    icon: "GraduationCap",
    section: "Growth & Focus",
    description: "IELTS prep, academic modules, flashcards & vocabulary",
  },
  {
    id: "developer-hub",
    name: "Developer Hub",
    href: "/developer-hub",
    icon: "Terminal",
    badge: "3 Projects",
    badgeType: "emerald",
    section: "Growth & Focus",
    description: "Aurelius IELTS, LinguaHub, Ravon Avto & code repositories",
  },
  {
    id: "finance",
    name: "Finance",
    href: "/finance",
    icon: "CircleDollarSign",
    section: "Growth & Focus",
    description: "Income streams, SaaS expenses, cashflow & net worth",
  },

  // 9-12: Intelligence
  {
    id: "xasan-ai",
    name: "XASAN AI",
    href: "/xasan-ai",
    icon: "Sparkles",
    badge: "Online",
    badgeType: "emerald",
    section: "Intelligence",
    description: "Personal autonomous intelligence & copilot engine",
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    href: "/knowledge-base",
    icon: "BookOpen",
    section: "Intelligence",
    description: "Second brain, architecture memos, tech notes & references",
  },
  {
    id: "goals",
    name: "Goals & Vision",
    href: "/goals",
    icon: "Compass",
    section: "Intelligence",
    description: "High-level vision, quarterly OKRs & life milestones",
  },
  {
    id: "analytics",
    name: "Analytics",
    href: "/analytics",
    icon: "BarChart3",
    section: "Intelligence",
    description: "Deep work velocity, habit consistency & productivity graphs",
  },

  // 13-15: System
  {
    id: "notifications",
    name: "Notifications",
    href: "/notifications",
    icon: "Bell",
    badge: "3",
    badgeType: "warning",
    section: "System",
    description: "System alerts, deadline nudges & habit reminders",
  },
  {
    id: "profile",
    name: "Profile",
    href: "/profile",
    icon: "User",
    section: "System",
    description: "Identity, biometric stats & personal configuration",
  },
  {
    id: "settings",
    name: "Settings",
    href: "/settings",
    icon: "Settings",
    section: "System",
    description: "System preferences, API keys, database & dark emerald theme",
  },
];
