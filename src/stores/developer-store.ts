"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ProjectSummary,
  DevBugSummary,
  DevFeatureSummary,
  DevDocSummary,
  DevDeploymentSummary,
  DevReleaseSummary,
  DevIntegrationSettingSummary,
  ProjectStatus,
  Priority,
} from "@/types";
import {
  FALLBACK_PROJECTS,
  FALLBACK_DEV_BUGS,
  FALLBACK_DEV_FEATURES,
  FALLBACK_DEV_DOCS,
  FALLBACK_DEV_DEPLOYMENTS,
  FALLBACK_DEV_RELEASES,
  FALLBACK_DEV_INTEGRATION,
} from "@/lib/constants";

interface DeveloperState {
  projects: ProjectSummary[];
  bugs: DevBugSummary[];
  features: DevFeatureSummary[];
  docs: DevDocSummary[];
  deployments: DevDeploymentSummary[];
  releases: DevReleaseSummary[];
  integration: DevIntegrationSettingSummary;
  isHydrated: boolean;

  // Project Actions
  addProject: (data: {
    name: string;
    slug?: string;
    description?: string;
    techStack?: string[];
    repositoryUrl?: string;
    liveUrl?: string;
    status?: ProjectStatus;
    priority?: Priority;
    color?: string;
    icon?: string;
  }) => ProjectSummary;

  updateProject: (id: string, updates: Partial<ProjectSummary>) => void;
  deleteProject: (id: string) => void;

  // Bug Actions
  addBug: (data: {
    projectId: string;
    title: string;
    description?: string;
    severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
    status?: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED" | string;
    module?: string;
    reproSteps?: string;
    projectName?: string;
  }) => DevBugSummary;

  updateBug: (id: string, updates: Partial<DevBugSummary>) => void;
  deleteBug: (id: string) => void;

  // Feature Actions
  addFeature: (data: {
    projectId: string;
    title: string;
    description?: string;
    priority?: "P0" | "P1" | "P2" | "P3" | string;
    status?: "BACKLOG" | "PLANNED" | "IN_DEVELOPMENT" | "SHIPPED" | string;
    targetVersion?: string;
    projectName?: string;
  }) => DevFeatureSummary;

  updateFeature: (id: string, updates: Partial<DevFeatureSummary>) => void;
  deleteFeature: (id: string) => void;

  // Docs Actions
  addDoc: (data: {
    projectId: string;
    title: string;
    category?: string;
    endpoint?: string;
    method?: string;
    content: string;
    requestPayload?: string;
    responsePayload?: string;
    projectName?: string;
  }) => DevDocSummary;

  updateDoc: (id: string, updates: Partial<DevDocSummary>) => void;
  deleteDoc: (id: string) => void;

  // Deployment Actions
  addDeployment: (data: {
    projectId: string;
    environment?: string;
    commitSha?: string;
    commitMessage?: string;
    branch?: string;
    status?: string;
    deploymentUrl?: string;
    buildDurationSec?: number;
    logSnippet?: string;
    source?: string;
    projectName?: string;
  }) => DevDeploymentSummary;

  deleteDeployment: (id: string) => void;

  // Release Actions
  addRelease: (data: {
    projectId: string;
    version: string;
    title: string;
    changelog: string;
    releaseDate?: string;
    projectName?: string;
  }) => DevReleaseSummary;

  deleteRelease: (id: string) => void;

  // Reset & Purge
  resetDeveloperToDefault: () => void;
  clearAllDeveloper: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useDeveloperStore = create<DeveloperState>()(
  persist(
    (set, get) => ({
      projects: FALLBACK_PROJECTS,
      bugs: FALLBACK_DEV_BUGS,
      features: FALLBACK_DEV_FEATURES,
      docs: FALLBACK_DEV_DOCS,
      deployments: FALLBACK_DEV_DEPLOYMENTS,
      releases: FALLBACK_DEV_RELEASES,
      integration: FALLBACK_DEV_INTEGRATION,
      isHydrated: false,

      addProject: (data) => {
        const id = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const slug =
          data.slug ||
          data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const newProject: ProjectSummary = {
          id,
          userId: "local-user",
          name: data.name,
          slug,
          description: data.description || null,
          status: data.status || ProjectStatus.ACTIVE,
          priority: data.priority || Priority.NORMAL,
          techStack: data.techStack || ["Next.js", "TypeScript", "Tailwind CSS"],
          repositoryUrl: data.repositoryUrl || null,
          liveUrl: data.liveUrl || null,
          progress: 10,
          color: data.color || "#10B981",
          icon: data.icon || "Layers",
          taskCount: 0,
          completedTaskCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          projects: [newProject, ...state.projects],
        }));

        return newProject;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      addBug: (data) => {
        const id = `bug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newBug: DevBugSummary = {
          id,
          userId: "local-user",
          projectId: data.projectId || "proj-1",
          title: data.title,
          description: data.description || null,
          severity: (data.severity || "MEDIUM") as any,
          status: (data.status || "OPEN") as any,
          module: data.module || null,
          reproSteps: data.reproSteps || null,
          projectName: data.projectName || "Core",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          bugs: [newBug, ...state.bugs],
        }));

        return newBug;
      },

      updateBug: (id, updates) => {
        set((state) => ({
          bugs: state.bugs.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
          ),
        }));
      },

      deleteBug: (id) => {
        set((state) => ({
          bugs: state.bugs.filter((b) => b.id !== id),
        }));
      },

      addFeature: (data) => {
        const id = `feat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newFeature: DevFeatureSummary = {
          id,
          userId: "local-user",
          projectId: data.projectId || "proj-1",
          title: data.title,
          description: data.description || null,
          priority: (data.priority || "P1") as any,
          status: (data.status || "BACKLOG") as any,
          targetVersion: data.targetVersion || "v2.0.0",
          projectName: data.projectName || "Core",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          features: [newFeature, ...state.features],
        }));

        return newFeature;
      },

      updateFeature: (id, updates) => {
        set((state) => ({
          features: state.features.map((f) =>
            f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
          ),
        }));
      },

      deleteFeature: (id) => {
        set((state) => ({
          features: state.features.filter((f) => f.id !== id),
        }));
      },

      addDoc: (data) => {
        const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newDoc: DevDocSummary = {
          id,
          userId: "local-user",
          projectId: data.projectId || "proj-1",
          title: data.title,
          category: data.category || "API",
          endpoint: data.endpoint || null,
          method: data.method || null,
          content: data.content,
          requestPayload: data.requestPayload || null,
          responsePayload: data.responsePayload || null,
          projectName: data.projectName || "Core",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          docs: [newDoc, ...state.docs],
        }));

        return newDoc;
      },

      updateDoc: (id, updates) => {
        set((state) => ({
          docs: state.docs.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          ),
        }));
      },

      deleteDoc: (id) => {
        set((state) => ({
          docs: state.docs.filter((d) => d.id !== id),
        }));
      },

      addDeployment: (data) => {
        const id = `dep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newDep: DevDeploymentSummary = {
          id,
          userId: "local-user",
          projectId: data.projectId || "proj-1",
          environment: data.environment || "PRODUCTION",
          commitSha: data.commitSha || "main",
          commitMessage: data.commitMessage || "Manual deployment logged",
          branch: data.branch || "main",
          status: data.status || "SUCCESS",
          deploymentUrl: data.deploymentUrl || null,
          buildDurationSec: data.buildDurationSec || 40,
          deployedAt: new Date().toISOString(),
          logSnippet: data.logSnippet || null,
          source: data.source || "MANUAL",
          projectName: data.projectName || "Core",
        };

        set((state) => ({
          deployments: [newDep, ...state.deployments],
        }));

        return newDep;
      },

      deleteDeployment: (id) => {
        set((state) => ({
          deployments: state.deployments.filter((d) => d.id !== id),
        }));
      },

      addRelease: (data) => {
        const id = `rel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newRel: DevReleaseSummary = {
          id,
          userId: "local-user",
          projectId: data.projectId || "proj-1",
          version: data.version,
          title: data.title,
          changelog: data.changelog,
          releaseDate: data.releaseDate || new Date().toISOString(),
          createdAt: new Date().toISOString(),
          projectName: data.projectName || "Core",
        };

        set((state) => ({
          releases: [newRel, ...state.releases],
        }));

        return newRel;
      },

      deleteRelease: (id) => {
        set((state) => ({
          releases: state.releases.filter((r) => r.id !== id),
        }));
      },

      resetDeveloperToDefault: () =>
        set({
          projects: FALLBACK_PROJECTS,
          bugs: FALLBACK_DEV_BUGS,
          features: FALLBACK_DEV_FEATURES,
          docs: FALLBACK_DEV_DOCS,
          deployments: FALLBACK_DEV_DEPLOYMENTS,
          releases: FALLBACK_DEV_RELEASES,
          integration: FALLBACK_DEV_INTEGRATION,
        }),

      clearAllDeveloper: () =>
        set({
          projects: [],
          bugs: [],
          features: [],
          docs: [],
          deployments: [],
          releases: [],
        }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "xasan_developer_storage",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState || !Array.isArray(persistedState.projects) || version < 2) {
          return {
            ...persistedState,
            projects: FALLBACK_PROJECTS,
          };
        }
        return persistedState;
      },
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
