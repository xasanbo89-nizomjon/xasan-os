"use server";

import prisma from "@/lib/prisma";
import {
  ProjectSummary,
  DevBugSummary,
  DevFeatureSummary,
  DevDocSummary,
  DevDeploymentSummary,
  DevReleaseSummary,
  DevIntegrationSettingSummary,
  GitHubRepoMetadata,
  GitHubCommitSummary,
  GitHubPullRequestSummary,
  GitHubIssueSummary,
  VercelProjectSummary,
  VercelDeploymentSummary,
  DeveloperHubMetrics,
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
  FALLBACK_GITHUB_REPOS,
  FALLBACK_GITHUB_COMMITS,
  FALLBACK_GITHUB_PRS,
  FALLBACK_GITHUB_ISSUES,
  FALLBACK_VERCEL_PROJECTS,
  FALLBACK_VERCEL_DEPLOYMENTS,
  FALLBACK_DEV_METRICS,
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

// ==================== PROJECT CRUD ACTIONS ====================

export async function getProjectsAction(filters?: {
  status?: string;
  search?: string;
}): Promise<ProjectSummary[]> {
  if (!isDatabaseConfigured()) {
    let projs = [...FALLBACK_PROJECTS];
    if (filters?.status && filters.status !== "ALL") {
      projs = projs.filter((p) => p.status.toUpperCase() === filters.status?.toUpperCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      projs = projs.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q))
      );
    }
    return projs;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };

    if (filters?.status && filters.status !== "ALL") {
      whereClause.status = filters.status as ProjectStatus;
    }
    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    if (projects.length === 0 && (!filters?.status || filters.status === "ALL") && !filters?.search) {
      return FALLBACK_PROJECTS;
    }

    return projects.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
      slug: p.slug,
      description: p.description,
      status: p.status,
      priority: p.priority,
      techStack: p.techStack,
      repositoryUrl: p.repositoryUrl,
      liveUrl: p.liveUrl,
      progress: p.progress,
      color: p.color,
      icon: p.icon,
      startDate: p.startDate ? p.startDate.toISOString() : null,
      targetDate: p.targetDate ? p.targetDate.toISOString() : null,
      taskCount: p._count.tasks,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB projects fallback:", error);
    return FALLBACK_PROJECTS;
  }
}

export async function createProjectAction(data: {
  name: string;
  description?: string;
  repositoryUrl?: string;
  liveUrl?: string;
  techStack: string[];
  startDate?: string;
  targetDate?: string;
  status?: ProjectStatus;
  priority?: Priority;
  progress?: number;
  color?: string;
  icon?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (!isDatabaseConfigured()) {
      const newProj: ProjectSummary = {
        id: `proj-sim-${Date.now()}`,
        userId: user.id,
        name: data.name,
        slug,
        description: data.description || null,
        status: data.status || ProjectStatus.ACTIVE,
        priority: data.priority || Priority.NORMAL,
        techStack: data.techStack || [],
        repositoryUrl: data.repositoryUrl || null,
        liveUrl: data.liveUrl || null,
        progress: data.progress || 0,
        color: data.color || "#10B981",
        icon: data.icon || "Code2",
        startDate: data.startDate || null,
        targetDate: data.targetDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, project: newProj };
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: data.name,
        slug,
        description: data.description || null,
        status: data.status || ProjectStatus.ACTIVE,
        priority: data.priority || Priority.NORMAL,
        techStack: data.techStack,
        repositoryUrl: data.repositoryUrl || null,
        liveUrl: data.liveUrl || null,
        progress: data.progress || 0,
        color: data.color || "#10B981",
        icon: data.icon || "Code2",
        startDate: data.startDate ? new Date(data.startDate) : null,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
      },
    });

    revalidatePath("/developer-hub");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Could not create project." };
  }
}

export async function updateProjectAction(id: string, updates: Partial<ProjectSummary>) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, updates };
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.status && { status: updates.status }),
        ...(updates.priority && { priority: updates.priority }),
        ...(updates.techStack && { techStack: updates.techStack }),
        ...(updates.repositoryUrl !== undefined && { repositoryUrl: updates.repositoryUrl }),
        ...(updates.liveUrl !== undefined && { liveUrl: updates.liveUrl }),
        ...(updates.progress !== undefined && { progress: updates.progress }),
        ...(updates.color && { color: updates.color }),
        ...(updates.startDate !== undefined && {
          startDate: updates.startDate ? new Date(updates.startDate) : null,
        }),
        ...(updates.targetDate !== undefined && {
          targetDate: updates.targetDate ? new Date(updates.targetDate) : null,
        }),
      },
    });

    revalidatePath("/developer-hub");
    return { success: true, project: updated };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Could not update project." };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    if (!isDatabaseConfigured()) return { success: true };
    await prisma.project.delete({ where: { id } });
    revalidatePath("/developer-hub");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Could not delete project." };
  }
}

// ==================== DEV BUGS ACTIONS ====================

export async function getDevBugsAction(projectId?: string): Promise<DevBugSummary[]> {
  if (!isDatabaseConfigured()) {
    if (!projectId || projectId === "ALL") return FALLBACK_DEV_BUGS;
    return FALLBACK_DEV_BUGS.filter((b) => b.projectId === projectId);
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };
    if (projectId && projectId !== "ALL") {
      whereClause.projectId = projectId;
    }

    const bugs = await prisma.devBug.findMany({
      where: whereClause,
      include: { project: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (bugs.length === 0 && (!projectId || projectId === "ALL")) {
      return FALLBACK_DEV_BUGS;
    }

    return bugs.map((b) => ({
      id: b.id,
      projectId: b.projectId,
      userId: b.userId,
      title: b.title,
      description: b.description,
      severity: b.severity as any,
      status: b.status as any,
      module: b.module,
      reproSteps: b.reproSteps,
      projectName: b.project?.name,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB bugs fallback:", error);
    return FALLBACK_DEV_BUGS;
  }
}

export async function createDevBugAction(data: {
  projectId: string;
  title: string;
  description?: string;
  severity: string;
  status?: string;
  module?: string;
  reproSteps?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();

    if (!isDatabaseConfigured()) {
      const proj = FALLBACK_PROJECTS.find((p) => p.id === data.projectId);
      const newBug: DevBugSummary = {
        id: `bug-sim-${Date.now()}`,
        projectId: data.projectId,
        userId: user.id,
        title: data.title,
        description: data.description,
        severity: data.severity as any,
        status: (data.status || "OPEN") as any,
        module: data.module,
        reproSteps: data.reproSteps,
        projectName: proj?.name || "Project",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, bug: newBug };
    }

    const bug = await prisma.devBug.create({
      data: {
        userId: user.id,
        projectId: data.projectId,
        title: data.title,
        description: data.description || null,
        severity: data.severity,
        status: data.status || "OPEN",
        module: data.module || null,
        reproSteps: data.reproSteps || null,
      },
      include: { project: { select: { name: true } } },
    });

    revalidatePath("/developer-hub");
    return { success: true, bug };
  } catch (error) {
    console.error("Failed to create bug:", error);
    return { success: false, error: "Could not create bug." };
  }
}

export async function updateDevBugStatusAction(id: string, status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED") {
  try {
    if (!isDatabaseConfigured()) return { success: true, status };
    const updated = await prisma.devBug.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/developer-hub");
    return { success: true, bug: updated };
  } catch (error) {
    console.error("Failed to update bug status:", error);
    return { success: false, error: "Could not update status." };
  }
}

export async function deleteDevBugAction(id: string) {
  try {
    if (!isDatabaseConfigured()) return { success: true };
    await prisma.devBug.delete({ where: { id } });
    revalidatePath("/developer-hub");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete bug:", error);
    return { success: false, error: "Could not delete bug." };
  }
}

// ==================== DEV FEATURES ACTIONS ====================

export async function getDevFeaturesAction(projectId?: string): Promise<DevFeatureSummary[]> {
  if (!isDatabaseConfigured()) {
    if (!projectId || projectId === "ALL") return FALLBACK_DEV_FEATURES;
    return FALLBACK_DEV_FEATURES.filter((f) => f.projectId === projectId);
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };
    if (projectId && projectId !== "ALL") {
      whereClause.projectId = projectId;
    }

    const features = await prisma.devFeature.findMany({
      where: whereClause,
      include: { project: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (features.length === 0 && (!projectId || projectId === "ALL")) {
      return FALLBACK_DEV_FEATURES;
    }

    return features.map((f) => ({
      id: f.id,
      projectId: f.projectId,
      userId: f.userId,
      title: f.title,
      description: f.description,
      priority: f.priority as any,
      status: f.status as any,
      targetVersion: f.targetVersion,
      projectName: f.project?.name,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB features fallback:", error);
    return FALLBACK_DEV_FEATURES;
  }
}

export async function createDevFeatureAction(data: {
  projectId: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  targetVersion?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();

    if (!isDatabaseConfigured()) {
      const proj = FALLBACK_PROJECTS.find((p) => p.id === data.projectId);
      const newFeat: DevFeatureSummary = {
        id: `feat-sim-${Date.now()}`,
        projectId: data.projectId,
        userId: user.id,
        title: data.title,
        description: data.description,
        priority: (data.priority || "P1") as any,
        status: (data.status || "BACKLOG") as any,
        targetVersion: data.targetVersion,
        projectName: proj?.name || "Project",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, feature: newFeat };
    }

    const feature = await prisma.devFeature.create({
      data: {
        userId: user.id,
        projectId: data.projectId,
        title: data.title,
        description: data.description || null,
        priority: data.priority || "P1",
        status: data.status || "BACKLOG",
        targetVersion: data.targetVersion || null,
      },
      include: { project: { select: { name: true } } },
    });

    revalidatePath("/developer-hub");
    return { success: true, feature };
  } catch (error) {
    console.error("Failed to create feature:", error);
    return { success: false, error: "Could not create feature." };
  }
}

export async function updateDevFeatureStatusAction(id: string, status: "BACKLOG" | "PLANNED" | "IN_DEVELOPMENT" | "SHIPPED") {
  try {
    if (!isDatabaseConfigured()) return { success: true, status };
    const updated = await prisma.devFeature.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/developer-hub");
    return { success: true, feature: updated };
  } catch (error) {
    console.error("Failed to update feature status:", error);
    return { success: false, error: "Could not update status." };
  }
}

export async function deleteDevFeatureAction(id: string) {
  try {
    if (!isDatabaseConfigured()) return { success: true };
    await prisma.devFeature.delete({ where: { id } });
    revalidatePath("/developer-hub");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete feature:", error);
    return { success: false, error: "Could not delete feature." };
  }
}

// ==================== DEV DOCS & API NOTES ====================

export async function getDevDocsAction(projectId?: string): Promise<DevDocSummary[]> {
  if (!isDatabaseConfigured()) {
    if (!projectId || projectId === "ALL") return FALLBACK_DEV_DOCS;
    return FALLBACK_DEV_DOCS.filter((d) => d.projectId === projectId);
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };
    if (projectId && projectId !== "ALL") {
      whereClause.projectId = projectId;
    }

    const docs = await prisma.devDoc.findMany({
      where: whereClause,
      include: { project: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    });

    if (docs.length === 0 && (!projectId || projectId === "ALL")) {
      return FALLBACK_DEV_DOCS;
    }

    return docs.map((d) => ({
      id: d.id,
      projectId: d.projectId,
      userId: d.userId,
      title: d.title,
      category: d.category,
      endpoint: d.endpoint,
      method: d.method,
      content: d.content,
      requestPayload: d.requestPayload,
      responsePayload: d.responsePayload,
      projectName: d.project?.name,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB docs fallback:", error);
    return FALLBACK_DEV_DOCS;
  }
}

export async function createDevDocAction(data: {
  projectId: string;
  title: string;
  category?: string;
  endpoint?: string;
  method?: string;
  content: string;
  requestPayload?: string;
  responsePayload?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();

    if (!isDatabaseConfigured()) {
      const proj = FALLBACK_PROJECTS.find((p) => p.id === data.projectId);
      const newDoc: DevDocSummary = {
        id: `doc-sim-${Date.now()}`,
        projectId: data.projectId,
        userId: user.id,
        title: data.title,
        category: data.category || "API",
        endpoint: data.endpoint,
        method: data.method,
        content: data.content,
        requestPayload: data.requestPayload,
        responsePayload: data.responsePayload,
        projectName: proj?.name || "Project",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, doc: newDoc };
    }

    const doc = await prisma.devDoc.create({
      data: {
        userId: user.id,
        projectId: data.projectId,
        title: data.title,
        category: data.category || "API",
        endpoint: data.endpoint || null,
        method: data.method || null,
        content: data.content,
        requestPayload: data.requestPayload || null,
        responsePayload: data.responsePayload || null,
      },
      include: { project: { select: { name: true } } },
    });

    revalidatePath("/developer-hub");
    return { success: true, doc };
  } catch (error) {
    console.error("Failed to create doc:", error);
    return { success: false, error: "Could not create documentation note." };
  }
}

export async function deleteDevDocAction(id: string) {
  try {
    if (!isDatabaseConfigured()) return { success: true };
    await prisma.devDoc.delete({ where: { id } });
    revalidatePath("/developer-hub");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete doc:", error);
    return { success: false, error: "Could not delete doc." };
  }
}

// ==================== DEPLOYMENTS & RELEASES ====================

export async function getDevDeploymentsAction(projectId?: string): Promise<DevDeploymentSummary[]> {
  if (!isDatabaseConfigured()) {
    if (!projectId || projectId === "ALL") return FALLBACK_DEV_DEPLOYMENTS;
    return FALLBACK_DEV_DEPLOYMENTS.filter((d) => d.projectId === projectId);
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };
    if (projectId && projectId !== "ALL") {
      whereClause.projectId = projectId;
    }

    const deployments = await prisma.devDeployment.findMany({
      where: whereClause,
      include: { project: { select: { name: true } } },
      orderBy: { deployedAt: "desc" },
      take: 20,
    });

    if (deployments.length === 0 && (!projectId || projectId === "ALL")) {
      return FALLBACK_DEV_DEPLOYMENTS;
    }

    return deployments.map((d) => ({
      id: d.id,
      projectId: d.projectId,
      userId: d.userId,
      environment: d.environment,
      commitSha: d.commitSha,
      commitMessage: d.commitMessage,
      branch: d.branch,
      status: d.status,
      deploymentUrl: d.deploymentUrl,
      buildDurationSec: d.buildDurationSec,
      deployedAt: d.deployedAt.toISOString(),
      logSnippet: d.logSnippet,
      source: d.source,
      projectName: d.project?.name,
    }));
  } catch (error) {
    console.warn("DB deployments fallback:", error);
    return FALLBACK_DEV_DEPLOYMENTS;
  }
}

export async function createDevDeploymentAction(data: {
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
}) {
  try {
    const user = await getOrCreateCurrentUser();

    if (!isDatabaseConfigured()) {
      const proj = FALLBACK_PROJECTS.find((p) => p.id === data.projectId);
      const newDep: DevDeploymentSummary = {
        id: `dep-sim-${Date.now()}`,
        projectId: data.projectId,
        userId: user.id,
        environment: data.environment || "PRODUCTION",
        commitSha: data.commitSha || "manual-sha",
        commitMessage: data.commitMessage || "Manual deployment logged",
        branch: data.branch || "main",
        status: data.status || "SUCCESS",
        deploymentUrl: data.deploymentUrl,
        buildDurationSec: data.buildDurationSec || 45,
        deployedAt: new Date().toISOString(),
        logSnippet: data.logSnippet,
        source: data.source || "MANUAL",
        projectName: proj?.name || "Project",
      };
      return { success: true, deployment: newDep };
    }

    const deployment = await prisma.devDeployment.create({
      data: {
        userId: user.id,
        projectId: data.projectId,
        environment: data.environment || "PRODUCTION",
        commitSha: data.commitSha || null,
        commitMessage: data.commitMessage || null,
        branch: data.branch || "main",
        status: data.status || "SUCCESS",
        deploymentUrl: data.deploymentUrl || null,
        buildDurationSec: data.buildDurationSec || null,
        logSnippet: data.logSnippet || null,
        source: data.source || "MANUAL",
      },
      include: { project: { select: { name: true } } },
    });

    revalidatePath("/developer-hub");
    return { success: true, deployment };
  } catch (error) {
    console.error("Failed to log deployment:", error);
    return { success: false, error: "Could not log deployment." };
  }
}

export async function getDevReleasesAction(projectId?: string): Promise<DevReleaseSummary[]> {
  if (!isDatabaseConfigured()) {
    if (!projectId || projectId === "ALL") return FALLBACK_DEV_RELEASES;
    return FALLBACK_DEV_RELEASES.filter((r) => r.projectId === projectId);
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };
    if (projectId && projectId !== "ALL") {
      whereClause.projectId = projectId;
    }

    const releases = await prisma.devRelease.findMany({
      where: whereClause,
      include: { project: { select: { name: true } } },
      orderBy: { releaseDate: "desc" },
    });

    if (releases.length === 0 && (!projectId || projectId === "ALL")) {
      return FALLBACK_DEV_RELEASES;
    }

    return releases.map((r) => ({
      id: r.id,
      projectId: r.projectId,
      userId: r.userId,
      version: r.version,
      title: r.title,
      changelog: r.changelog,
      releaseDate: r.releaseDate.toISOString(),
      createdAt: r.createdAt.toISOString(),
      projectName: r.project?.name,
    }));
  } catch (error) {
    console.warn("DB releases fallback:", error);
    return FALLBACK_DEV_RELEASES;
  }
}

export async function createDevReleaseAction(data: {
  projectId: string;
  version: string;
  title: string;
  changelog: string;
  releaseDate?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();

    if (!isDatabaseConfigured()) {
      const proj = FALLBACK_PROJECTS.find((p) => p.id === data.projectId);
      const newRel: DevReleaseSummary = {
        id: `rel-sim-${Date.now()}`,
        projectId: data.projectId,
        userId: user.id,
        version: data.version,
        title: data.title,
        changelog: data.changelog,
        releaseDate: data.releaseDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        projectName: proj?.name || "Project",
      };
      return { success: true, release: newRel };
    }

    const release = await prisma.devRelease.create({
      data: {
        userId: user.id,
        projectId: data.projectId,
        version: data.version,
        title: data.title,
        changelog: data.changelog,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : new Date(),
      },
      include: { project: { select: { name: true } } },
    });

    revalidatePath("/developer-hub");
    return { success: true, release };
  } catch (error) {
    console.error("Failed to create release:", error);
    return { success: false, error: "Could not create release." };
  }
}

// ==================== GITHUB & VERCEL INTEGRATIONS & SYNC ====================

export async function getDevIntegrationAction(): Promise<DevIntegrationSettingSummary> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_DEV_INTEGRATION;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const setting = await prisma.devIntegrationSetting.findUnique({
      where: { userId: user.id },
    });

    if (!setting) {
      return FALLBACK_DEV_INTEGRATION;
    }

    return {
      id: setting.id,
      userId: setting.userId,
      githubConnected: setting.githubConnected,
      githubUsername: setting.githubUsername,
      githubToken: setting.githubToken ? "••••••••••••••••" : null,
      githubLastSync: setting.githubLastSync ? setting.githubLastSync.toISOString() : null,
      vercelConnected: setting.vercelConnected,
      vercelUsername: setting.vercelUsername,
      vercelToken: setting.vercelToken ? "••••••••••••••••" : null,
      vercelLastSync: setting.vercelLastSync ? setting.vercelLastSync.toISOString() : null,
      monitoringMode: setting.monitoringMode,
    };
  } catch (error) {
    console.warn("DB integration fallback:", error);
    return FALLBACK_DEV_INTEGRATION;
  }
}

export async function connectGitHubAction(username: string, token: string) {
  try {
    const user = await getOrCreateCurrentUser();
    if (!isDatabaseConfigured()) {
      return { success: true, username, connected: true };
    }

    await prisma.devIntegrationSetting.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        githubConnected: true,
        githubUsername: username,
        githubToken: token,
        githubLastSync: new Date(),
      },
      update: {
        githubConnected: true,
        githubUsername: username,
        githubToken: token,
        githubLastSync: new Date(),
      },
    });

    revalidatePath("/developer-hub");
    return { success: true };
  } catch (error) {
    console.error("Failed to connect GitHub:", error);
    return { success: false, error: "Failed to connect GitHub." };
  }
}

export async function disconnectGitHubAction() {
  try {
    const user = await getOrCreateCurrentUser();
    if (!isDatabaseConfigured()) return { success: true };

    await prisma.devIntegrationSetting.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        githubConnected: false,
        githubUsername: null,
        githubToken: null,
      },
      update: {
        githubConnected: false,
        githubUsername: null,
        githubToken: null,
      },
    });

    revalidatePath("/developer-hub");
    return { success: true };
  } catch (error) {
    console.error("Failed to disconnect GitHub:", error);
    return { success: false, error: "Failed to disconnect GitHub." };
  }
}

export async function connectVercelAction(username: string, token: string) {
  try {
    const user = await getOrCreateCurrentUser();
    if (!isDatabaseConfigured()) {
      return { success: true, username, connected: true };
    }

    await prisma.devIntegrationSetting.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        vercelConnected: true,
        vercelUsername: username,
        vercelToken: token,
        vercelLastSync: new Date(),
      },
      update: {
        vercelConnected: true,
        vercelUsername: username,
        vercelToken: token,
        vercelLastSync: new Date(),
      },
    });

    revalidatePath("/developer-hub");
    return { success: true };
  } catch (error) {
    console.error("Failed to connect Vercel:", error);
    return { success: false, error: "Failed to connect Vercel." };
  }
}

export async function disconnectVercelAction() {
  try {
    const user = await getOrCreateCurrentUser();
    if (!isDatabaseConfigured()) return { success: true };

    await prisma.devIntegrationSetting.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        vercelConnected: false,
        vercelUsername: null,
        vercelToken: null,
      },
      update: {
        vercelConnected: false,
        vercelUsername: null,
        vercelToken: null,
      },
    });

    revalidatePath("/developer-hub");
    return { success: true };
  } catch (error) {
    console.error("Failed to disconnect Vercel:", error);
    return { success: false, error: "Failed to disconnect Vercel." };
  }
}

export async function triggerLiveSyncAction(type: "GITHUB" | "VERCEL" | "ALL") {
  try {
    const user = await getOrCreateCurrentUser();
    const now = new Date();

    if (isDatabaseConfigured()) {
      const updateData: any = {};
      if (type === "GITHUB" || type === "ALL") updateData.githubLastSync = now;
      if (type === "VERCEL" || type === "ALL") updateData.vercelLastSync = now;

      await prisma.devIntegrationSetting.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          ...updateData,
        },
        update: updateData,
      });
    }

    revalidatePath("/developer-hub");
    return { success: true, syncedAt: now.toISOString() };
  } catch (error) {
    console.error("Failed to trigger sync:", error);
    return { success: false, error: "Failed to synchronize telemetry." };
  }
}

// Remote data queries
export async function getGitHubDataAction(): Promise<{
  repos: GitHubRepoMetadata[];
  commits: GitHubCommitSummary[];
  pullRequests: GitHubPullRequestSummary[];
  issues: GitHubIssueSummary[];
}> {
  return {
    repos: FALLBACK_GITHUB_REPOS,
    commits: FALLBACK_GITHUB_COMMITS,
    pullRequests: FALLBACK_GITHUB_PRS,
    issues: FALLBACK_GITHUB_ISSUES,
  };
}

export async function getVercelDataAction(): Promise<{
  projects: VercelProjectSummary[];
  deployments: VercelDeploymentSummary[];
}> {
  return {
    projects: FALLBACK_VERCEL_PROJECTS,
    deployments: FALLBACK_VERCEL_DEPLOYMENTS,
  };
}

export async function getDeveloperHubMetricsAction(): Promise<DeveloperHubMetrics> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_DEV_METRICS;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const [projects, bugs, features, deployments, setting] = await Promise.all([
      prisma.project.findMany({ where: { userId: user.id } }),
      prisma.devBug.findMany({ where: { userId: user.id } }),
      prisma.devFeature.findMany({ where: { userId: user.id } }),
      prisma.devDeployment.findMany({ where: { userId: user.id } }),
      prisma.devIntegrationSetting.findUnique({ where: { userId: user.id } }),
    ]);

    const totalProjects = projects.length || FALLBACK_DEV_METRICS.totalProjects;
    const activeProjects = projects.filter((p) => p.status === "ACTIVE").length || FALLBACK_DEV_METRICS.activeProjects;
    const openBugs = bugs.filter((b) => b.status === "OPEN" || b.status === "INVESTIGATING").length || FALLBACK_DEV_METRICS.openBugs;
    const criticalBugs = bugs.filter((b) => b.severity === "CRITICAL" && (b.status === "OPEN" || b.status === "INVESTIGATING")).length || FALLBACK_DEV_METRICS.criticalBugs;
    const backlogFeatures = features.filter((f) => f.status === "BACKLOG" || f.status === "PLANNED").length || FALLBACK_DEV_METRICS.backlogFeatures;

    const successfulDeps = deployments.filter((d) => d.status === "SUCCESS").length;
    const successRate = deployments.length > 0
      ? parseFloat(((successfulDeps / deployments.length) * 100).toFixed(1))
      : 96.4;

    return {
      totalProjects,
      activeProjects,
      openBugs,
      criticalBugs,
      backlogFeatures,
      deploymentsThisMonth: deployments.length || FALLBACK_DEV_METRICS.deploymentsThisMonth,
      deploymentSuccessRate: successRate,
      githubSyncedAt: setting?.githubLastSync ? setting.githubLastSync.toISOString() : FALLBACK_DEV_METRICS.githubSyncedAt,
      vercelSyncedAt: setting?.vercelLastSync ? setting.vercelLastSync.toISOString() : FALLBACK_DEV_METRICS.vercelSyncedAt,
    };
  } catch (error) {
    console.warn("DB dev metrics fallback:", error);
    return FALLBACK_DEV_METRICS;
  }
}
