import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StudyCenterExperience } from "@/components/study/study-center-experience";
import {
  getStudyMetricsAction,
  getIeltsRecordsAction,
  getExamResultsAction,
  getArabicLogsAction,
  getVocabCardsAction,
  getStudySessionsAction,
} from "@/server/actions/study";

export const metadata = {
  title: "Study Center | XASAN OS Ultimate",
  description:
    "IELTS Band 8.5 preparation workspace, Arabic CEFR C1 studies, and SM-2 Spaced Repetition vocabulary engine.",
};

export default async function StudyCenterPage() {
  const [
    metrics,
    ieltsRecords,
    examResults,
    arabicLogs,
    vocabCards,
    studySessions,
  ] = await Promise.all([
    getStudyMetricsAction(),
    getIeltsRecordsAction(),
    getExamResultsAction(),
    getArabicLogsAction(),
    getVocabCardsAction(),
    getStudySessionsAction(),
  ]);

  return (
    <AppShell>
      <StudyCenterExperience
        metrics={metrics}
        ieltsRecords={ieltsRecords}
        examResults={examResults}
        arabicLogs={arabicLogs}
        vocabCards={vocabCards}
        studySessions={studySessions}
      />
    </AppShell>
  );
}
