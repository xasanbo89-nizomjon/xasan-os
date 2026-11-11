export const Priority = {
  LOW: "LOW",
  NORMAL: "NORMAL",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;
export type Priority = (typeof Priority)[keyof typeof Priority];

export const TaskStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const ProjectStatus = {
  PLANNING: "PLANNING",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
  TRANSFER: "TRANSFER",
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export interface NavItem {
  id: string;
  name: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: "default" | "emerald" | "urgent";
  category: "Core" | "Growth" | "Intelligence" | "System";
  shortcut?: string;
}

export interface UserSummary {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  role: string;
}

export interface SubtaskSummary {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface TaskSummary {
  id: string;
  userId: string;
  projectId?: string | null;
  project?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;
  title: string;
  description?: string | null;
  category?: string;
  priority: Priority;
  status: TaskStatus;
  startDate?: Date | string | null;
  dueDate?: Date | string | null;
  completedAt?: Date | string | null;
  estimatedMinutes?: number;
  actualMinutes?: number;
  recurrence?: string;
  subtasks?: SubtaskSummary[];
  tags: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CalendarEventSummary {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: "PERSONAL" | "EDUCATION" | "WORK" | "PROJECT" | string;
  startDate: Date | string;
  endDate: Date | string;
  allDay: boolean;
  location?: string | null;
  projectId?: string | null;
  isRecurring: boolean;
  recurrence?: string | null;
  reminderMin?: number | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ReminderSummary {
  id: string;
  userId: string;
  title: string;
  dueDateTime: Date | string;
  isCompleted: boolean;
  category: string;
  isRecurring: boolean;
  recurrence?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface FocusSessionSummary {
  id: string;
  userId: string;
  taskId?: string | null;
  subject: string;
  durationMinutes: number;
  completedAt: Date | string;
  notes?: string | null;
  mode: "POMODORO" | "DEEP_WORK" | "SHORT_BREAK" | "LONG_BREAK" | string;
}

export interface HabitLogSummary {
  id: string;
  habitId: string;
  userId: string;
  date: string;
  completedAt: Date | string;
  count: number;
  notes?: string | null;
}

export interface HabitSummary {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  frequency: string;
  targetDaysPerWeek: number;
  targetCount: number;
  unit: string;
  category: string;
  color: string;
  streak: number;
  bestStreak: number;
  archived: boolean;
  reminderTime?: string | null;
  isCompletedToday?: boolean;
  completionRate?: number;
  missedDaysCount?: number;
  recentLogs?: HabitLogSummary[];
  createdAt: Date | string;
}

export interface WellnessLogSummary {
  id: string;
  userId: string;
  date: string;
  sleepHours: number;
  exerciseMinutes: number;
  waterGlasses: number;
  mood: string;
  energyLevel: number;
  notes?: string | null;
  createdAt: Date | string;
}

export interface GoalMilestoneSummary {
  id: string;
  goalId: string;
  title: string;
  isCompleted: boolean;
  targetDate?: Date | string | null;
  order: number;
  completedAt?: Date | string | null;
  createdAt: Date | string;
}

export interface GoalSummary {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: "Education" | "Career" | "Finance" | "Health" | "Technology" | "Personal Development" | "Travel" | string;
  timeframe: "SHORT_TERM" | "LONG_TERM" | "ANNUAL" | string;
  priority: Priority;
  progress: number;
  targetDate?: Date | string | null;
  completedAt?: Date | string | null;
  isAchieved: boolean;
  milestones?: GoalMilestoneSummary[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface VisionItemSummary {
  id: string;
  userId: string;
  title: string;
  statement: string;
  category: string;
  imageUrl?: string | null;
  targetYear?: number | null;
  isPinned: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface JournalEntrySummary {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  tags: string[];
  isPrivate: boolean;
  isArchived: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProjectSummary {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string | null;
  status: ProjectStatus;
  priority: Priority;
  techStack: string[];
  repositoryUrl?: string | null;
  liveUrl?: string | null;
  progress: number;
  color?: string | null;
  icon?: string | null;
  startDate?: Date | string | null;
  targetDate?: Date | string | null;
  taskCount?: number;
  completedTaskCount?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TransactionSummary {
  id: string;
  userId: string;
  title: string;
  amount: number | string;
  type: TransactionType;
  category: string;
  account: string;
  date: Date | string;
  notes?: string | null;
  tags: string[];
  createdAt: Date | string;
}

export interface KnowledgeNoteSummary {
  id: string;
  userId: string;
  title: string;
  content: string;
  summary?: string | null;
  category: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IeltsPracticeRecordSummary {
  id: string;
  userId: string;
  section: "LISTENING" | "READING" | "WRITING" | "SPEAKING" | string;
  title: string;
  taskType?: string | null;
  prompt?: string | null;
  submission?: string | null;
  bandScore?: number | null;
  durationMinutes?: number | null;
  wordCount?: number | null;
  feedback?: string | null;
  audioUrl?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ExamResultSummary {
  id: string;
  userId: string;
  examType: string;
  title: string;
  listeningScore: number;
  readingScore: number;
  writingScore: number;
  speakingScore: number;
  overallBand: number;
  date: Date | string;
  notes?: string | null;
  createdAt: Date | string;
}

export interface ArabicPracticeLogSummary {
  id: string;
  userId: string;
  skill: "LISTENING" | "READING" | "WRITING" | "SPEAKING" | "GRAMMAR" | string;
  topic: string;
  cefrLevel: string;
  grammarFocus?: string | null;
  notes?: string | null;
  durationMinutes: number;
  date: Date | string;
  createdAt: Date | string;
}

export interface VocabularyCardSummary {
  id: string;
  userId: string;
  word: string;
  translation: string;
  language: "ENGLISH" | "ARABIC" | string;
  difficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | string;
  topic: string;
  phonetic?: string | null;
  exampleSentence?: string | null;
  exampleTranslation?: string | null;
  status: "NEW" | "LEARNING" | "REVIEWING" | "MASTERED" | string;
  repetition: number;
  interval: number;
  easeFactor: number;
  nextReviewDate: Date | string;
  lastReviewedAt?: Date | string | null;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StudySessionSummary {
  id: string;
  userId: string;
  subject: string;
  durationMinutes: number;
  notes?: string | null;
  completedAt: Date | string;
}

export interface StudyCenterMetrics {
  targetBand: number;
  estimatedBand: number;
  arabicCefrLevel: string;
  totalStudyHours: number;
  cardsMastered: number;
  cardsReviewDue: number;
  mockTestsCompleted: number;
  averageMockScore: number;
}

export interface DashboardMetrics {
  tasks: {
    pending: number;
    completed: number;
    urgent: number;
  };
  habits: {
    active: number;
    completedToday: number;
    completionRate: number;
  };
  projects: {
    active: number;
    completed: number;
  };
  finance: {
    balance: number;
    incomeThisMonth: number;
    expensesThisMonth: number;
  };
}

export interface DevBugSummary {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description?: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED";
  module?: string | null;
  reproSteps?: string | null;
  projectName?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DevFeatureSummary {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description?: string | null;
  priority: "P0" | "P1" | "P2" | "P3";
  status: "BACKLOG" | "PLANNED" | "IN_DEVELOPMENT" | "SHIPPED";
  targetVersion?: string | null;
  projectName?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DevDocSummary {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  category: "API" | "ARCHITECTURE" | "ENVIRONMENT" | "GUIDE" | string;
  endpoint?: string | null;
  method?: "GET" | "POST" | "PUT" | "DELETE" | string | null;
  content: string;
  requestPayload?: string | null;
  responsePayload?: string | null;
  projectName?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DevDeploymentSummary {
  id: string;
  projectId: string;
  userId: string;
  environment: "PRODUCTION" | "PREVIEW" | "STAGING" | string;
  commitSha?: string | null;
  commitMessage?: string | null;
  branch: string;
  status: "SUCCESS" | "FAILED" | "BUILDING" | string;
  deploymentUrl?: string | null;
  buildDurationSec?: number | null;
  deployedAt: Date | string;
  logSnippet?: string | null;
  source: "MANUAL" | "VERCEL" | "GITHUB_ACTIONS" | string;
  projectName?: string;
}

export interface DevReleaseSummary {
  id: string;
  projectId: string;
  userId: string;
  version: string;
  title: string;
  changelog: string;
  releaseDate: Date | string;
  createdAt: Date | string;
  projectName?: string;
}

export interface DevIntegrationSettingSummary {
  id?: string;
  userId: string;
  githubConnected: boolean;
  githubUsername?: string | null;
  githubToken?: string | null;
  githubLastSync?: Date | string | null;
  vercelConnected: boolean;
  vercelUsername?: string | null;
  vercelToken?: string | null;
  vercelLastSync?: Date | string | null;
  monitoringMode: "LIVE" | "CACHED" | "MANUAL" | "HYBRID" | string;
  updatedAt?: Date | string;
}

export interface GitHubRepoMetadata {
  id: number | string;
  name: string;
  fullName: string;
  htmlUrl: string;
  description?: string | null;
  language?: string | null;
  starsCount: number;
  forksCount: number;
  openIssuesCount: number;
  defaultBranch: string;
  updatedAt: string;
}

export interface GitHubCommitSummary {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  authorAvatar?: string;
  date: string;
  htmlUrl: string;
  verified: boolean;
}

export interface GitHubPullRequestSummary {
  number: number;
  title: string;
  author: string;
  branch: string;
  status: "OPEN" | "MERGED" | "CLOSED";
  htmlUrl: string;
  createdAt: string;
}

export interface GitHubIssueSummary {
  number: number;
  title: string;
  author: string;
  status: "OPEN" | "CLOSED";
  labels: string[];
  htmlUrl: string;
  createdAt: string;
}

export interface VercelProjectSummary {
  id: string;
  name: string;
  framework: string;
  latestDeploymentStatus: "READY" | "BUILDING" | "ERROR" | "CANCELED";
  deploymentUrl: string;
  domains: string[];
  updatedAt: string;
}

export interface VercelDeploymentSummary {
  id: string;
  name: string;
  url: string;
  state: "READY" | "BUILDING" | "ERROR" | "CANCELED";
  target: "production" | "preview";
  branch: string;
  commitMessage?: string;
  creator: string;
  createdAt: string;
  durationMs?: number;
  errorMessage?: string;
  buildLogSnippet?: string;
}

export interface DeveloperHubMetrics {
  totalProjects: number;
  activeProjects: number;
  openBugs: number;
  criticalBugs: number;
  backlogFeatures: number;
  deploymentsThisMonth: number;
  deploymentSuccessRate: number;
  githubSyncedAt?: string | null;
  vercelSyncedAt?: string | null;
}
