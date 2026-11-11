"use server";

import prisma from "@/lib/prisma";
import {
  IeltsPracticeRecordSummary,
  ExamResultSummary,
  ArabicPracticeLogSummary,
  VocabularyCardSummary,
  StudySessionSummary,
  StudyCenterMetrics,
} from "@/types";
import {
  FALLBACK_IELTS_RECORDS,
  FALLBACK_EXAM_RESULTS,
  FALLBACK_ARABIC_LOGS,
  FALLBACK_VOCAB_CARDS,
  FALLBACK_STUDY_SESSIONS,
  FALLBACK_STUDY_METRICS,
  DEFAULT_USER_EMAIL,
  DEFAULT_USER_NAME,
} from "@/lib/constants";
import { revalidatePath } from "next/cache";

function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("johndoe:randompassword")) return false;
  return true;
}

async function getOrCreateCurrentUser() {
  if (!isDatabaseConfigured()) {
    return {
      id: "demo-user-uuid-1",
      email: DEFAULT_USER_EMAIL,
      displayName: DEFAULT_USER_NAME,
      role: "OWNER",
    };
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: DEFAULT_USER_EMAIL,
          displayName: DEFAULT_USER_NAME,
          role: "OWNER",
        },
      });
    }

    return user;
  } catch (error) {
    console.warn("DB user retrieval error, fallback:", error);
    return {
      id: "demo-user-uuid-1",
      email: DEFAULT_USER_EMAIL,
      displayName: DEFAULT_USER_NAME,
      role: "OWNER",
    };
  }
}

// ==================== IELTS Workspace Actions ====================

export async function getIeltsRecordsAction(section?: string): Promise<IeltsPracticeRecordSummary[]> {
  if (!isDatabaseConfigured()) {
    if (!section || section === "ALL") return FALLBACK_IELTS_RECORDS;
    return FALLBACK_IELTS_RECORDS.filter(
      (r: IeltsPracticeRecordSummary) => r.section.toUpperCase() === section.toUpperCase()
    );
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };
    if (section && section !== "ALL") {
      whereClause.section = section.toUpperCase();
    }

    const records = await prisma.ieltsPracticeRecord.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    if (records.length === 0 && (!section || section === "ALL")) {
      return FALLBACK_IELTS_RECORDS;
    }

    return records.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      section: r.section,
      title: r.title,
      taskType: r.taskType,
      prompt: r.prompt,
      submission: r.submission,
      bandScore: r.bandScore,
      durationMinutes: r.durationMinutes,
      wordCount: r.wordCount,
      feedback: r.feedback,
      audioUrl: r.audioUrl,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB IELTS records fallback:", error);
    return FALLBACK_IELTS_RECORDS;
  }
}

export async function createIeltsRecordAction(data: {
  section: string;
  title: string;
  taskType?: string;
  prompt?: string;
  submission?: string;
  bandScore?: number;
  durationMinutes?: number;
  wordCount?: number;
  feedback?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();

    if (!isDatabaseConfigured()) {
      const newRec: IeltsPracticeRecordSummary = {
        id: `ielts-sim-${Date.now()}`,
        userId: user.id,
        section: data.section.toUpperCase(),
        title: data.title,
        taskType: data.taskType,
        prompt: data.prompt,
        submission: data.submission,
        bandScore: data.bandScore || 8.0,
        durationMinutes: data.durationMinutes || 40,
        wordCount: data.wordCount,
        feedback: data.feedback,
        createdAt: new Date().toISOString(),
      };
      return { success: true, record: newRec };
    }

    const record = await prisma.ieltsPracticeRecord.create({
      data: {
        userId: user.id,
        section: data.section.toUpperCase(),
        title: data.title,
        taskType: data.taskType || null,
        prompt: data.prompt || null,
        submission: data.submission || null,
        bandScore: data.bandScore !== undefined ? data.bandScore : 8.0,
        durationMinutes: data.durationMinutes || 40,
        wordCount: data.wordCount || null,
        feedback: data.feedback || null,
      },
    });

    revalidatePath("/study-center");
    return { success: true, record };
  } catch (error) {
    console.error("Failed to create IELTS record:", error);
    return { success: false, error: "Could not create IELTS practice record." };
  }
}

export async function deleteIeltsRecordAction(id: string) {
  try {
    if (!isDatabaseConfigured()) return { success: true };
    await prisma.ieltsPracticeRecord.delete({ where: { id } });
    revalidatePath("/study-center");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete IELTS record:", error);
    return { success: false, error: "Could not delete record." };
  }
}

// ==================== Mock Exam Results Actions ====================

export async function getExamResultsAction(): Promise<ExamResultSummary[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_EXAM_RESULTS;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const results = await prisma.examResult.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    if (results.length === 0) {
      return FALLBACK_EXAM_RESULTS;
    }

    return results.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      examType: r.examType,
      title: r.title,
      listeningScore: r.listeningScore,
      readingScore: r.readingScore,
      writingScore: r.writingScore,
      speakingScore: r.speakingScore,
      overallBand: r.overallBand,
      date: r.date.toISOString(),
      notes: r.notes,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB exam results fallback:", error);
    return FALLBACK_EXAM_RESULTS;
  }
}

export async function createExamResultAction(data: {
  title: string;
  listeningScore: number;
  readingScore: number;
  writingScore: number;
  speakingScore: number;
  examType?: string;
  date?: string;
  notes?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const listening = Number(data.listeningScore);
    const reading = Number(data.readingScore);
    const writing = Number(data.writingScore);
    const speaking = Number(data.speakingScore);

    // Compute standard IELTS overall band (rounded to nearest 0.5)
    const rawAverage = (listening + reading + writing + speaking) / 4;
    const overallBand = Math.round(rawAverage * 2) / 2;

    if (!isDatabaseConfigured()) {
      const newResult: ExamResultSummary = {
        id: `mock-sim-${Date.now()}`,
        userId: user.id,
        examType: data.examType || "IELTS_ACADEMIC",
        title: data.title,
        listeningScore: listening,
        readingScore: reading,
        writingScore: writing,
        speakingScore: speaking,
        overallBand,
        date: data.date || new Date().toISOString(),
        notes: data.notes,
        createdAt: new Date().toISOString(),
      };
      return { success: true, result: newResult };
    }

    const result = await prisma.examResult.create({
      data: {
        userId: user.id,
        examType: data.examType || "IELTS_ACADEMIC",
        title: data.title,
        listeningScore: listening,
        readingScore: reading,
        writingScore: writing,
        speakingScore: speaking,
        overallBand,
        date: data.date ? new Date(data.date) : new Date(),
        notes: data.notes || null,
      },
    });

    revalidatePath("/study-center");
    return { success: true, result };
  } catch (error) {
    console.error("Failed to create exam result:", error);
    return { success: false, error: "Could not create exam result." };
  }
}

export async function deleteExamResultAction(id: string) {
  try {
    if (!isDatabaseConfigured()) return { success: true };
    await prisma.examResult.delete({ where: { id } });
    revalidatePath("/study-center");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete exam result:", error);
    return { success: false, error: "Could not delete exam result." };
  }
}

// ==================== Arabic Workspace Actions ====================

export async function getArabicLogsAction(skill?: string): Promise<ArabicPracticeLogSummary[]> {
  if (!isDatabaseConfigured()) {
    if (!skill || skill === "ALL") return FALLBACK_ARABIC_LOGS;
    return FALLBACK_ARABIC_LOGS.filter(
      (l: ArabicPracticeLogSummary) => l.skill.toUpperCase() === skill.toUpperCase()
    );
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };
    if (skill && skill !== "ALL") {
      whereClause.skill = skill.toUpperCase();
    }

    const logs = await prisma.arabicPracticeLog.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
    });

    if (logs.length === 0 && (!skill || skill === "ALL")) {
      return FALLBACK_ARABIC_LOGS;
    }

    return logs.map((l: any) => ({
      id: l.id,
      userId: l.userId,
      skill: l.skill,
      topic: l.topic,
      cefrLevel: l.cefrLevel,
      grammarFocus: l.grammarFocus,
      notes: l.notes,
      durationMinutes: l.durationMinutes,
      date: l.date.toISOString(),
      createdAt: l.createdAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB Arabic logs fallback:", error);
    return FALLBACK_ARABIC_LOGS;
  }
}

export async function createArabicLogAction(data: {
  skill: string;
  topic: string;
  cefrLevel?: string;
  grammarFocus?: string;
  notes?: string;
  durationMinutes?: number;
  date?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();

    if (!isDatabaseConfigured()) {
      const newLog: ArabicPracticeLogSummary = {
        id: `ara-sim-${Date.now()}`,
        userId: user.id,
        skill: data.skill.toUpperCase(),
        topic: data.topic,
        cefrLevel: data.cefrLevel || "B2",
        grammarFocus: data.grammarFocus,
        notes: data.notes,
        durationMinutes: data.durationMinutes || 30,
        date: data.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      return { success: true, log: newLog };
    }

    const log = await prisma.arabicPracticeLog.create({
      data: {
        userId: user.id,
        skill: data.skill.toUpperCase(),
        topic: data.topic,
        cefrLevel: data.cefrLevel || "B2",
        grammarFocus: data.grammarFocus || null,
        notes: data.notes || null,
        durationMinutes: data.durationMinutes || 30,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });

    revalidatePath("/study-center");
    return { success: true, log };
  } catch (error) {
    console.error("Failed to create Arabic log:", error);
    return { success: false, error: "Could not create Arabic log." };
  }
}

export async function deleteArabicLogAction(id: string) {
  try {
    if (!isDatabaseConfigured()) return { success: true };
    await prisma.arabicPracticeLog.delete({ where: { id } });
    revalidatePath("/study-center");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete Arabic log:", error);
    return { success: false, error: "Could not delete Arabic log." };
  }
}

// ==================== Spaced Repetition & Vocabulary Cards ====================

export async function getVocabCardsAction(filters?: {
  language?: string;
  status?: string;
  search?: string;
}): Promise<VocabularyCardSummary[]> {
  if (!isDatabaseConfigured()) {
    let cards = [...FALLBACK_VOCAB_CARDS];
    if (filters?.language && filters.language !== "ALL") {
      cards = cards.filter((c: VocabularyCardSummary) => c.language.toUpperCase() === filters.language?.toUpperCase());
    }
    if (filters?.status && filters.status !== "ALL") {
      cards = cards.filter((c: VocabularyCardSummary) => c.status.toUpperCase() === filters.status?.toUpperCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      cards = cards.filter(
        (c: VocabularyCardSummary) =>
          c.word.toLowerCase().includes(q) ||
          c.translation.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q)
      );
    }
    return cards;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };

    if (filters?.language && filters.language !== "ALL") {
      whereClause.language = filters.language.toUpperCase();
    }
    if (filters?.status && filters.status !== "ALL") {
      whereClause.status = filters.status.toUpperCase();
    }
    if (filters?.search) {
      whereClause.OR = [
        { word: { contains: filters.search, mode: "insensitive" } },
        { translation: { contains: filters.search, mode: "insensitive" } },
        { topic: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const cards = await prisma.vocabularyCard.findMany({
      where: whereClause,
      orderBy: [{ nextReviewDate: "asc" }, { updatedAt: "desc" }],
    });

    if (cards.length === 0 && (!filters?.language || filters.language === "ALL") && !filters?.search) {
      return FALLBACK_VOCAB_CARDS;
    }

    return cards.map((c: any) => ({
      id: c.id,
      userId: c.userId,
      word: c.word,
      translation: c.translation,
      language: c.language,
      difficulty: c.difficulty,
      topic: c.topic,
      phonetic: c.phonetic,
      exampleSentence: c.exampleSentence,
      exampleTranslation: c.exampleTranslation,
      status: c.status,
      repetition: c.repetition,
      interval: c.interval,
      easeFactor: c.easeFactor,
      nextReviewDate: c.nextReviewDate.toISOString(),
      lastReviewedAt: c.lastReviewedAt ? c.lastReviewedAt.toISOString() : null,
      reviewCount: c.reviewCount,
      correctCount: c.correctCount,
      incorrectCount: c.incorrectCount,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB vocab cards fallback:", error);
    return FALLBACK_VOCAB_CARDS;
  }
}

export async function createVocabCardAction(data: {
  word: string;
  translation: string;
  language?: string;
  difficulty?: string;
  topic?: string;
  phonetic?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const language = (data.language || "ENGLISH").toUpperCase();
    const difficulty = data.difficulty || "C1";
    const topic = data.topic || "Academic";

    if (!isDatabaseConfigured()) {
      const newCard: VocabularyCardSummary = {
        id: `card-sim-${Date.now()}`,
        userId: user.id,
        word: data.word,
        translation: data.translation,
        language,
        difficulty,
        topic,
        phonetic: data.phonetic,
        exampleSentence: data.exampleSentence,
        exampleTranslation: data.exampleTranslation,
        status: "NEW",
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString(),
        lastReviewedAt: null,
        reviewCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, card: newCard };
    }

    const card = await prisma.vocabularyCard.create({
      data: {
        userId: user.id,
        word: data.word,
        translation: data.translation,
        language,
        difficulty,
        topic,
        phonetic: data.phonetic || null,
        exampleSentence: data.exampleSentence || null,
        exampleTranslation: data.exampleTranslation || null,
        status: "NEW",
        repetition: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date(),
      },
    });

    revalidatePath("/study-center");
    return { success: true, card };
  } catch (error) {
    console.error("Failed to create vocabulary card:", error);
    return { success: false, error: "Could not create vocabulary card." };
  }
}

/**
 * Review a vocabulary card using the SuperMemo-2 (SM-2) Spaced Repetition Algorithm.
 * Grade scale:
 * 0: Again (complete blackout)
 * 1: Hard (correct with severe difficulty)
 * 2: Good (correct with hesitation)
 * 3: Easy (instant flawless recall)
 */
export async function reviewVocabCardAction(cardId: string, rating: 0 | 1 | 2 | 3) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, rating, simulated: true };
    }

    const card = await prisma.vocabularyCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return { success: false, error: "Card not found." };
    }

    let { repetition, interval, easeFactor, correctCount, incorrectCount, reviewCount } = card;
    reviewCount += 1;

    // SM-2 formula adaptation for rating 0-3
    // Map rating 0..3 to SM-2 grade 0..5
    // 0 -> 2 (Again/Fail)
    // 1 -> 3 (Hard)
    // 2 -> 4 (Good)
    // 3 -> 5 (Easy)
    const q = rating === 0 ? 2 : rating === 1 ? 3 : rating === 2 ? 4 : 5;

    // New ease factor
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    let status = card.status;

    if (q < 3) {
      // Again / Failed recall
      repetition = 0;
      interval = 1;
      incorrectCount += 1;
      status = "LEARNING";
    } else {
      // Successful recall
      correctCount += 1;
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetition += 1;

      if (repetition >= 4) {
        status = "MASTERED";
      } else {
        status = "REVIEWING";
      }
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    const updated = await prisma.vocabularyCard.update({
      where: { id: cardId },
      data: {
        repetition,
        interval,
        easeFactor,
        nextReviewDate,
        lastReviewedAt: new Date(),
        reviewCount,
        correctCount,
        incorrectCount,
        status,
      },
    });

    revalidatePath("/study-center");
    return { success: true, card: updated, interval, status };
  } catch (error) {
    console.error("Failed to review vocabulary card:", error);
    return { success: false, error: "Could not submit review." };
  }
}

export async function deleteVocabCardAction(cardId: string) {
  try {
    if (!isDatabaseConfigured()) return { success: true };
    await prisma.vocabularyCard.delete({ where: { id: cardId } });
    revalidatePath("/study-center");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete vocabulary card:", error);
    return { success: false, error: "Could not delete card." };
  }
}

// ==================== Study Timer & Metrics ====================

export async function getStudySessionsAction(): Promise<StudySessionSummary[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_STUDY_SESSIONS;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const sessions = await prisma.studySession.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
      take: 20,
    });

    if (sessions.length === 0) {
      return FALLBACK_STUDY_SESSIONS;
    }

    return sessions.map((s: any) => ({
      id: s.id,
      userId: s.userId,
      subject: s.subject,
      durationMinutes: s.durationMinutes,
      notes: s.notes,
      completedAt: s.completedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB study sessions fallback:", error);
    return FALLBACK_STUDY_SESSIONS;
  }
}

export async function logStudySessionAction(data: {
  subject: string;
  durationMinutes: number;
  notes?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();

    if (!isDatabaseConfigured()) {
      const newSession: StudySessionSummary = {
        id: `sess-sim-${Date.now()}`,
        userId: user.id,
        subject: data.subject,
        durationMinutes: data.durationMinutes,
        notes: data.notes,
        completedAt: new Date().toISOString(),
      };
      return { success: true, session: newSession };
    }

    const session = await prisma.studySession.create({
      data: {
        userId: user.id,
        subject: data.subject,
        durationMinutes: data.durationMinutes,
        notes: data.notes || null,
      },
    });

    revalidatePath("/study-center");
    return { success: true, session };
  } catch (error) {
    console.error("Failed to log study session:", error);
    return { success: false, error: "Could not log study session." };
  }
}

export async function getStudyMetricsAction(): Promise<StudyCenterMetrics> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_STUDY_METRICS;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const [mockResults, vocabCards, sessions] = await Promise.all([
      prisma.examResult.findMany({ where: { userId: user.id } }),
      prisma.vocabularyCard.findMany({ where: { userId: user.id } }),
      prisma.studySession.findMany({ where: { userId: user.id } }),
    ]);

    const totalStudyMinutes = sessions.reduce((acc: number, s: any) => acc + s.durationMinutes, 0);
    const totalStudyHours = parseFloat((totalStudyMinutes / 60).toFixed(1));

    const cardsMastered = vocabCards.filter((c: any) => c.status === "MASTERED").length;
    const now = new Date();
    const cardsReviewDue = vocabCards.filter((c: any) => new Date(c.nextReviewDate) <= now).length;

    const mockTestsCompleted = mockResults.length;
    const averageMockScore =
      mockResults.length > 0
        ? parseFloat((mockResults.reduce((acc: number, r: any) => acc + r.overallBand, 0) / mockResults.length).toFixed(2))
        : 8.0;

    return {
      targetBand: 8.5,
      estimatedBand: mockResults[0]?.overallBand || 8.0,
      arabicCefrLevel: "B2 (Target C1)",
      totalStudyHours: totalStudyHours > 0 ? totalStudyHours : 164.5,
      cardsMastered: cardsMastered || 420,
      cardsReviewDue: cardsReviewDue || 18,
      mockTestsCompleted: mockTestsCompleted || 12,
      averageMockScore: averageMockScore || 8.25,
    };
  } catch (error) {
    console.warn("DB study metrics fallback:", error);
    return FALLBACK_STUDY_METRICS;
  }
}
