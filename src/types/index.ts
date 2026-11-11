import { Priority, TaskStatus, ProjectStatus, TransactionType } from "@prisma/client";

export type { Priority, TaskStatus, ProjectStatus, TransactionType };

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
