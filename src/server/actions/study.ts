"use server";

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
} from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getIeltsRecordsAction(section?: string): Promise<IeltsPracticeRecordSummary[]> {
  if (!section || section === "ALL") return FALLBACK_IELTS_RECORDS;
  return FALLBACK_IELTS_RECORDS.filter(
    (r: IeltsPracticeRecordSummary) => r.section.toUpperCase() === section.toUpperCase()
  );
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
  const newRec: IeltsPracticeRecordSummary = {
    id: `ielts-local-${Date.now()}`,
    userId: "local-user",
    section: data.section.toUpperCase(),
    title: data.title,
    taskType: data.taskType || null,
    prompt: data.prompt || null,
    submission: data.submission || null,
    bandScore: data.bandScore !== undefined ? data.bandScore : 8.0,
    durationMinutes: data.durationMinutes || 40,
    wordCount: data.wordCount || null,
    feedback: data.feedback || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/study-center");
  return { success: true, record: newRec };
}

export async function deleteIeltsRecordAction(id: string) {
  revalidatePath("/study-center");
  return { success: true, id };
}

export async function getExamResultsAction(): Promise<ExamResultSummary[]> {
  return FALLBACK_EXAM_RESULTS;
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
  const listening = Number(data.listeningScore);
  const reading = Number(data.readingScore);
  const writing = Number(data.writingScore);
  const speaking = Number(data.speakingScore);
  const overallBand = Math.round(((listening + reading + writing + speaking) / 4) * 2) / 2;

  const newResult: ExamResultSummary = {
    id: `mock-local-${Date.now()}`,
    userId: "local-user",
    examType: data.examType || "IELTS_ACADEMIC",
    title: data.title,
    listeningScore: listening,
    readingScore: reading,
    writingScore: writing,
    speakingScore: speaking,
    overallBand,
    date: data.date || new Date().toISOString(),
    notes: data.notes || null,
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/study-center");
  return { success: true, result: newResult };
}

export async function deleteExamResultAction(id: string) {
  revalidatePath("/study-center");
  return { success: true, id };
}

export async function getArabicLogsAction(skill?: string): Promise<ArabicPracticeLogSummary[]> {
  if (!skill || skill === "ALL") return FALLBACK_ARABIC_LOGS;
  return FALLBACK_ARABIC_LOGS.filter(
    (l: ArabicPracticeLogSummary) => l.skill.toUpperCase() === skill.toUpperCase()
  );
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
  const newLog: ArabicPracticeLogSummary = {
    id: `ara-local-${Date.now()}`,
    userId: "local-user",
    skill: data.skill.toUpperCase(),
    topic: data.topic,
    cefrLevel: data.cefrLevel || "B2",
    grammarFocus: data.grammarFocus || null,
    notes: data.notes || null,
    durationMinutes: data.durationMinutes || 30,
    date: data.date || new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/study-center");
  return { success: true, log: newLog };
}

export async function deleteArabicLogAction(id: string) {
  revalidatePath("/study-center");
  return { success: true, id };
}

export async function getVocabCardsAction(filters?: {
  language?: string;
  status?: string;
  search?: string;
}): Promise<VocabularyCardSummary[]> {
  let cards = [...FALLBACK_VOCAB_CARDS];
  if (filters?.language && filters.language !== "ALL") {
    cards = cards.filter((c: VocabularyCardSummary) => c.language.toUpperCase() === filters.language?.toUpperCase());
  }
  if (filters?.status && filters.status !== "ALL") {
    cards = cards.filter((c: VocabularyCardSummary) => c.status.toUpperCase() === filters.status?.toUpperCase());
  }
  return cards;
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
  const newCard: VocabularyCardSummary = {
    id: `card-local-${Date.now()}`,
    userId: "local-user",
    word: data.word,
    translation: data.translation,
    language: (data.language || "ENGLISH").toUpperCase(),
    difficulty: data.difficulty || "C1",
    topic: data.topic || "Academic",
    phonetic: data.phonetic || null,
    exampleSentence: data.exampleSentence || null,
    exampleTranslation: data.exampleTranslation || null,
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

  revalidatePath("/study-center");
  return { success: true, card: newCard };
}

export async function reviewVocabCardAction(cardId: string, rating: 0 | 1 | 2 | 3) {
  revalidatePath("/study-center");
  return { success: true, cardId, rating };
}

export async function deleteVocabCardAction(cardId: string) {
  revalidatePath("/study-center");
  return { success: true, cardId };
}

export async function getStudySessionsAction(): Promise<StudySessionSummary[]> {
  return FALLBACK_STUDY_SESSIONS;
}

export async function logStudySessionAction(data: {
  subject: string;
  durationMinutes: number;
  notes?: string;
}) {
  const newSession: StudySessionSummary = {
    id: `sess-local-${Date.now()}`,
    userId: "local-user",
    subject: data.subject,
    durationMinutes: data.durationMinutes,
    notes: data.notes || null,
    completedAt: new Date().toISOString(),
  };

  revalidatePath("/study-center");
  return { success: true, session: newSession };
}

export async function getStudyMetricsAction(): Promise<StudyCenterMetrics> {
  return FALLBACK_STUDY_METRICS;
}
