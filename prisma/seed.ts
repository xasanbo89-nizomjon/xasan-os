import { PrismaClient, Priority, TaskStatus, ProjectStatus, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding XASAN OS Ultimate database...");

  // 1. Create or upsert primary user
  const user = await prisma.user.upsert({
    where: { email: "xasan@os.local" },
    update: {},
    create: {
      email: "xasan@os.local",
      displayName: "Xasan Mukhammadiev",
      role: "OWNER",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`User created or verified: ${user.displayName} (${user.id})`);

  // 2. Seed Developer Hub Projects
  const aurelius = await prisma.project.upsert({
    where: { userId_slug: { userId: user.id, slug: "aurelius-ielts" } },
    update: {},
    create: {
      userId: user.id,
      name: "Aurelius IELTS",
      slug: "aurelius-ielts",
      description: "AI-powered band 8.5 preparation ecosystem with automated speech scoring & essay evaluation.",
      status: ProjectStatus.ACTIVE,
      priority: Priority.URGENT,
      techStack: ["Next.js 16", "TypeScript", "OpenAI Whisper", "PostgreSQL", "Tailwind CSS"],
      progress: 78,
      color: "#10B981",
      icon: "GraduationCap",
      repositoryUrl: "https://github.com/xasan/aurelius-ielts",
      liveUrl: "https://aurelius-ielts.app",
    },
  });

  const linguahub = await prisma.project.upsert({
    where: { userId_slug: { userId: user.id, slug: "lingua-hub" } },
    update: {},
    create: {
      userId: user.id,
      name: "LinguaHub",
      slug: "lingua-hub",
      description: "Cross-platform spaced repetition vocabulary builder with automated contextual audio pronunciation.",
      status: ProjectStatus.ACTIVE,
      priority: Priority.HIGH,
      techStack: ["React Native", "Expo", "Supabase", "TypeScript"],
      progress: 54,
      color: "#3B82F6",
      icon: "Languages",
      repositoryUrl: "https://github.com/xasan/lingua-hub",
    },
  });

  const ravon = await prisma.project.upsert({
    where: { userId_slug: { userId: user.id, slug: "ravon-avto" } },
    update: {},
    create: {
      userId: user.id,
      name: "Ravon Avto",
      slug: "ravon-avto",
      description: "Automotive marketplace platform with real-time vin decoding, financing calculator & dealer CRM.",
      status: ProjectStatus.ACTIVE,
      priority: Priority.NORMAL,
      techStack: ["Next.js", "Prisma ORM", "PostgreSQL", "Tailwind CSS"],
      progress: 92,
      color: "#F59E0B",
      icon: "Car",
      liveUrl: "https://ravonavto.uz",
    },
  });

  console.log("Projects seeded: Aurelius IELTS, LinguaHub, Ravon Avto");

  // 3. Seed Tasks
  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        projectId: aurelius.id,
        title: "Deploy Whisper fine-tuned speech analysis engine",
        description: "Integrate custom audio latency processing pipeline with streaming audio feedback.",
        priority: Priority.URGENT,
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date(Date.now() + 86400000),
        tags: ["AI", "Audio", "Backend"],
      },
      {
        userId: user.id,
        projectId: linguahub.id,
        title: "Implement SuperMemo-2 SRS algorithm for card reviews",
        description: "Mathematical review scheduling based on user recall difficulty coefficient.",
        priority: Priority.HIGH,
        status: TaskStatus.PENDING,
        dueDate: new Date(Date.now() + 172800000),
        tags: ["Algorithm", "Mobile"],
      },
      {
        userId: user.id,
        projectId: ravon.id,
        title: "Finalize dealer inventory automated sync webhooks",
        description: "Ensure idempotency keys and error retry exponential backoff are configured.",
        priority: Priority.NORMAL,
        status: TaskStatus.COMPLETED,
        dueDate: new Date(),
        tags: ["API", "Webhooks"],
      },
      {
        userId: user.id,
        title: "Review System Design Architecture Memo #42",
        description: "Multi-region database read replicas & failover strategies.",
        priority: Priority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date(Date.now() + 259200000),
        tags: ["Architecture", "Study"],
      },
    ],
    skipDuplicates: true,
  });

  // 4. Seed Habits
  const habit1 = await prisma.habit.create({
    data: {
      userId: user.id,
      name: "Deep Architecture & Coding",
      description: "Minimum 2 hours uninterrupted deep work session",
      frequency: "DAILY",
      targetDaysPerWeek: 7,
      targetCount: 120,
      unit: "minutes",
      category: "CODE",
      color: "#10B981",
      streak: 21,
      bestStreak: 45,
    },
  });

  const todayStr = new Date().toISOString().split("T")[0];
  await prisma.habitLog.upsert({
    where: { habitId_date: { habitId: habit1.id, date: todayStr } },
    update: {},
    create: {
      habitId: habit1.id,
      userId: user.id,
      date: todayStr,
      count: 120,
      notes: "Architected XASAN OS App Shell and Prisma schema.",
    },
  });

  // 5. Seed Transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        title: "High-Performance Arch Consulting",
        amount: 4850.0,
        type: TransactionType.INCOME,
        category: "Engineering Client",
        account: "Business Wire",
        tags: ["Revenue", "Consulting"],
      },
      {
        userId: user.id,
        title: "AWS Cloud Infrastructure & GPU Nodes",
        amount: 320.0,
        type: TransactionType.EXPENSE,
        category: "Cloud Compute",
        account: "Corporate Card",
        tags: ["SaaS", "Servers"],
      },
      {
        userId: user.id,
        title: "GitHub Copilot & AI API Credits",
        amount: 140.0,
        type: TransactionType.EXPENSE,
        category: "AI Tools",
        account: "Corporate Card",
        tags: ["AI", "Sub"],
      },
    ],
  });

  // 6. Seed Knowledge Notes
  await prisma.knowledgeNote.createMany({
    data: [
      {
        userId: user.id,
        title: "Distributed Consensus: Raft vs Multi-Paxos",
        content: "Deep architectural comparison regarding leader election latency, log replication idempotency, and cluster membership reconfiguration.",
        summary: "Comparison of consensus models in production distributed state machines.",
        category: "Distributed Systems",
        tags: ["Architecture", "System Design", "Backend"],
        isPinned: true,
        isFavorite: true,
      },
      {
        userId: user.id,
        title: "IELTS Writing Task 2: Cohesion & Lexical Resource Band 9",
        content: "Framework for thematic topic sentence progression, counter-argument balance, and idiomatic collocations.",
        summary: "High-band essay argumentation structure.",
        category: "IELTS Preparation",
        tags: ["IELTS", "Writing", "English"],
        isPinned: true,
        isFavorite: false,
      },
    ],
  });

  console.log("XASAN OS Ultimate Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
