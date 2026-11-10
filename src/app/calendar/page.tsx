import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Calendar as CalendarIcon } from "lucide-react";
import { getCalendarEventsAction, getRemindersAction } from "@/server/actions/calendar";
import { getDashboardData } from "@/server/actions/os";
import { CalendarExperience } from "@/components/calendar/calendar-experience";

export const metadata = {
  title: "Calendar & Milestones | XASAN OS",
  description: "Chronological schedule, project milestone deadlines, and deep-work calendar blocks.",
};

export default async function CalendarPage() {
  const [events, reminders, dashboardData] = await Promise.all([
    getCalendarEventsAction(),
    getRemindersAction(),
    getDashboardData(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={CalendarIcon}
          badge="TIME ARCHITECTURE"
          title="Calendar & Milestones"
          description="Chronological schedule, project milestone deadlines, recurring reminders, and deep-work calendar blocks."
        />

        <CalendarExperience
          initialEvents={events}
          initialReminders={reminders}
          projects={dashboardData.projects}
        />
      </div>
    </AppShell>
  );
}
