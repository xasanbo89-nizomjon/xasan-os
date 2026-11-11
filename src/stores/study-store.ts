"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  IeltsPracticeRecordSummary,
  ExamResultSummary,
  ArabicPracticeLogSummary,
  VocabularyCardSummary,
  StudySessionSummary,
} from "@/types";
import {
  FALLBACK_IELTS_RECORDS,
  FALLBACK_EXAM_RESULTS,
  FALLBACK_ARABIC_LOGS,
  FALLBACK_VOCAB_CARDS,
  FALLBACK_STUDY_SESSIONS,
} from "@/lib/constants";

interface StudyState {
  ieltsRecords: IeltsPracticeRecordSummary[];
  examResults: ExamResultSummary[];
  arabicLogs: ArabicPracticeLogSummary[];
  vocabCards: VocabularyCardSummary[];
  studySessions: StudySessionSummary[];
  isHydrated: boolean;

  // IELTS Actions
  addIeltsRecord: (data: {
    section: string;
    title: string;
    taskType?: string;
    prompt?: string;
    submission?: string;
    bandScore?: number;
    durationMinutes?: number;
    wordCount?: number;
    feedback?: string;
  }) => IeltsPracticeRecordSummary;

  deleteIeltsRecord: (id: string) => void;

  // Exam Result Actions
  addExamResult: (data: {
    title: string;
    listeningScore: number;
    readingScore: number;
    writingScore: number;
    speakingScore: number;
    examType?: string;
    date?: string;
    notes?: string;
  }) => ExamResultSummary;

  deleteExamResult: (id: string) => void;

  // Arabic Practice Actions
  addArabicLog: (data: {
    skill: string;
    topic: string;
    cefrLevel?: string;
    grammarFocus?: string;
    notes?: string;
    durationMinutes?: number;
    date?: string;
  }) => ArabicPracticeLogSummary;

  deleteArabicLog: (id: string) => void;

  // Vocabulary Cards & SM-2 Algorithm
  addVocabCard: (data: {
    word: string;
    translation: string;
    language?: string;
    difficulty?: string;
    topic?: string;
    phonetic?: string;
    exampleSentence?: string;
    exampleTranslation?: string;
  }) => VocabularyCardSummary;

  reviewVocabCard: (cardId: string, rating: 0 | 1 | 2 | 3) => void;
  deleteVocabCard: (id: string) => void;

  // Study Sessions
  logStudySession: (data: {
    subject: string;
    durationMinutes: number;
    notes?: string;
  }) => StudySessionSummary;

  // Reset & Purge
  resetStudyToDefault: () => void;
  clearAllStudy: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      ieltsRecords: FALLBACK_IELTS_RECORDS,
      examResults: FALLBACK_EXAM_RESULTS,
      arabicLogs: FALLBACK_ARABIC_LOGS,
      vocabCards: FALLBACK_VOCAB_CARDS,
      studySessions: FALLBACK_STUDY_SESSIONS,
      isHydrated: false,

      addIeltsRecord: (data) => {
        const id = `ielts-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newRecord: IeltsPracticeRecordSummary = {
          id,
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

        set((state) => ({
          ieltsRecords: [newRecord, ...state.ieltsRecords],
        }));

        return newRecord;
      },

      deleteIeltsRecord: (id) => {
        set((state) => ({
          ieltsRecords: state.ieltsRecords.filter((r) => r.id !== id),
        }));
      },

      addExamResult: (data) => {
        const id = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const listening = Number(data.listeningScore);
        const reading = Number(data.readingScore);
        const writing = Number(data.writingScore);
        const speaking = Number(data.speakingScore);
        const rawAvg = (listening + reading + writing + speaking) / 4;
        const overallBand = Math.round(rawAvg * 2) / 2;

        const newResult: ExamResultSummary = {
          id,
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

        set((state) => ({
          examResults: [newResult, ...state.examResults],
        }));

        return newResult;
      },

      deleteExamResult: (id) => {
        set((state) => ({
          examResults: state.examResults.filter((r) => r.id !== id),
        }));
      },

      addArabicLog: (data) => {
        const id = `ara-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newLog: ArabicPracticeLogSummary = {
          id,
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

        set((state) => ({
          arabicLogs: [newLog, ...state.arabicLogs],
        }));

        return newLog;
      },

      deleteArabicLog: (id) => {
        set((state) => ({
          arabicLogs: state.arabicLogs.filter((l) => l.id !== id),
        }));
      },

      addVocabCard: (data) => {
        const id = `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newCard: VocabularyCardSummary = {
          id,
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

        set((state) => ({
          vocabCards: [newCard, ...state.vocabCards],
        }));

        return newCard;
      },

      reviewVocabCard: (cardId, rating) => {
        set((state) => ({
          vocabCards: state.vocabCards.map((card) => {
            if (card.id !== cardId) return card;

            let { repetition, interval, easeFactor, correctCount, incorrectCount, reviewCount } = card;
            reviewCount += 1;

            // SM-2 rating mapping (0: Again, 1: Hard, 2: Good, 3: Easy)
            const q = rating === 0 ? 2 : rating === 1 ? 3 : rating === 2 ? 4 : 5;

            easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
            if (easeFactor < 1.3) easeFactor = 1.3;

            let status = card.status;
            if (q < 3) {
              repetition = 0;
              interval = 1;
              incorrectCount += 1;
              status = "LEARNING";
            } else {
              correctCount += 1;
              if (repetition === 0) {
                interval = 1;
              } else if (repetition === 1) {
                interval = 6;
              } else {
                interval = Math.round(interval * easeFactor);
              }
              repetition += 1;
              status = repetition >= 4 ? "MASTERED" : "REVIEWING";
            }

            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + interval);

            return {
              ...card,
              repetition,
              interval,
              easeFactor,
              reviewCount,
              correctCount,
              incorrectCount,
              status,
              lastReviewedAt: new Date().toISOString(),
              nextReviewDate: nextDate.toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteVocabCard: (id) => {
        set((state) => ({
          vocabCards: state.vocabCards.filter((c) => c.id !== id),
        }));
      },

      logStudySession: (data) => {
        const id = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newSession: StudySessionSummary = {
          id,
          userId: "local-user",
          subject: data.subject,
          durationMinutes: data.durationMinutes,
          notes: data.notes || null,
          completedAt: new Date().toISOString(),
        };

        set((state) => ({
          studySessions: [newSession, ...state.studySessions],
        }));

        return newSession;
      },

      resetStudyToDefault: () =>
        set({
          ieltsRecords: FALLBACK_IELTS_RECORDS,
          examResults: FALLBACK_EXAM_RESULTS,
          arabicLogs: FALLBACK_ARABIC_LOGS,
          vocabCards: FALLBACK_VOCAB_CARDS,
          studySessions: FALLBACK_STUDY_SESSIONS,
        }),

      clearAllStudy: () =>
        set({
          ieltsRecords: [],
          examResults: [],
          arabicLogs: [],
          vocabCards: [],
          studySessions: [],
        }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "xasan_study_storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
