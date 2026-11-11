"use server";

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
} from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getDeveloperHubMetricsAction(): Promise<DeveloperHubMetrics> {
  return FALLBACK_DEV_METRICS;
}

export async function getProjectsAction(): Promise<ProjectSummary[]> {
  return FALLBACK_PROJECTS;
}

export async function createProjectAction(data: {
  name: string;
  slug?: string;
  description?: string;
  techStack?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  status?: ProjectStatus;
  priority?: Priority;
  color?: string;
  startDate?: string;
  targetDate?: string;
  progress?: number;
}) {
  const id = `proj-local-${Date.now()}`;
  const slug =
    data.slug ||
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const newProj: ProjectSummary = {
    id,
    userId: "local-user",
    name: data.name,
    slug,
    description: data.description || null,
    status: data.status || ProjectStatus.ACTIVE,
    priority: data.priority || Priority.NORMAL,
    techStack: data.techStack || ["Next.js", "TypeScript"],
    repositoryUrl: data.repositoryUrl || null,
    liveUrl: data.liveUrl || null,
    progress: data.progress || 10,
    color: data.color || "#10B981",
    startDate: data.startDate || null,
    targetDate: data.targetDate || null,
    icon: "Code2",
    taskCount: 0,
    completedTaskCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/developer-hub");
  revalidatePath("/");
  return { success: true, project: newProj };
}

export async function updateProjectAction(
  id: string,
  updates: Partial<ProjectSummary>
) {
  revalidatePath("/developer-hub");
  revalidatePath("/");
  return { success: true, id, updates };
}

export async function deleteProjectAction(id: string) {
  revalidatePath("/developer-hub");
  revalidatePath("/");
  return { success: true, id };
}

export async function getDevBugsAction(projectId?: string): Promise<DevBugSummary[]> {
  if (projectId) {
    return FALLBACK_DEV_BUGS.filter((b) => b.projectId === projectId);
  }
  return FALLBACK_DEV_BUGS;
}

export async function createDevBugAction(data: {
  title: string;
  description?: string;
  severity?: string;
  priority?: string;
  projectId?: string;
  module?: string;
  reproSteps?: string;
}) {
  const id = `bug-local-${Date.now()}`;
  const newBug: DevBugSummary = {
    id,
    userId: "local-user",
    projectId: data.projectId || "proj-1",
    title: data.title,
    description: data.description || null,
    severity: (data.severity || "MEDIUM") as any,
    status: "OPEN",
    module: data.module || null,
    reproSteps: data.reproSteps || null,
    projectName: "Project",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/developer-hub");
  return { success: true, bug: newBug };
}

export async function updateDevBugAction(id: string, updates: Partial<DevBugSummary>) {
  revalidatePath("/developer-hub");
  return { success: true, id, updates };
}

export async function updateDevBugStatusAction(id: string, status: any) {
  return updateDevBugAction(id, { status });
}

export async function deleteDevBugAction(id: string) {
  revalidatePath("/developer-hub");
  return { success: true, id };
}

export async function getDevFeaturesAction(projectId?: string): Promise<DevFeatureSummary[]> {
  if (projectId) {
    return FALLBACK_DEV_FEATURES.filter((f) => f.projectId === projectId);
  }
  return FALLBACK_DEV_FEATURES;
}

export async function createDevFeatureAction(data: {
  title: string;
  description?: string;
  priority?: string;
  targetVersion?: string;
  projectId?: string;
}) {
  const newFeature: DevFeatureSummary = {
    id: `feat-local-${Date.now()}`,
    userId: "local-user",
    projectId: data.projectId || "proj-1",
    title: data.title,
    description: data.description || null,
    priority: (data.priority || "P1") as any,
    status: "PLANNED",
    targetVersion: data.targetVersion || "v2.0.0",
    projectName: "Project",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/developer-hub");
  return { success: true, feature: newFeature };
}

export async function updateDevFeatureAction(id: string, updates: Partial<DevFeatureSummary>) {
  revalidatePath("/developer-hub");
  return { success: true, id, updates };
}

export async function updateDevFeatureStatusAction(id: string, status: any) {
  return updateDevFeatureAction(id, { status });
}

export async function deleteDevFeatureAction(id: string) {
  revalidatePath("/developer-hub");
  return { success: true, id };
}

export async function getDevDocsAction(projectId?: string): Promise<DevDocSummary[]> {
  if (projectId) {
    return FALLBACK_DEV_DOCS.filter((d) => d.projectId === projectId);
  }
  return FALLBACK_DEV_DOCS;
}

export async function createDevDocAction(data: {
  title: string;
  content: string;
  category?: string;
  endpoint?: string;
  method?: string;
  requestPayload?: string;
  responsePayload?: string;
  projectId?: string;
}) {
  const newDoc: DevDocSummary = {
    id: `doc-local-${Date.now()}`,
    userId: "local-user",
    projectId: data.projectId || "proj-1",
    title: data.title,
    content: data.content,
    category: data.category || "API",
    endpoint: data.endpoint || null,
    method: data.method || null,
    requestPayload: data.requestPayload || null,
    responsePayload: data.responsePayload || null,
    projectName: "Project",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/developer-hub");
  return { success: true, doc: newDoc };
}

export async function updateDevDocAction(id: string, updates: Partial<DevDocSummary>) {
  revalidatePath("/developer-hub");
  return { success: true, id, updates };
}

export async function deleteDevDocAction(id: string) {
  revalidatePath("/developer-hub");
  return { success: true, id };
}

export async function getDevDeploymentsAction(): Promise<DevDeploymentSummary[]> {
  return FALLBACK_DEV_DEPLOYMENTS;
}

export async function createDevDeploymentAction(data: {
  projectId?: string;
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
  const newDeployment: DevDeploymentSummary = {
    id: `dep-local-${Date.now()}`,
    userId: "local-user",
    projectId: data.projectId || "proj-1",
    environment: (data.environment || "PRODUCTION") as any,
    commitSha: data.commitSha || "main",
    commitMessage: data.commitMessage || "Manual deployment logged",
    branch: data.branch || "main",
    status: (data.status || "SUCCESS") as any,
    deploymentUrl: data.deploymentUrl || null,
    buildDurationSec: data.buildDurationSec || 40,
    deployedAt: new Date().toISOString(),
    logSnippet: data.logSnippet || null,
    source: (data.source || "MANUAL") as any,
    projectName: "Project",
  };

  revalidatePath("/developer-hub");
  return { success: true, deployment: newDeployment };
}

export async function getDevReleasesAction(): Promise<DevReleaseSummary[]> {
  return FALLBACK_DEV_RELEASES;
}

export async function createDevReleaseAction(data: {
  projectId?: string;
  version: string;
  title: string;
  changelog: string;
  releaseDate?: string;
}) {
  const newRelease: DevReleaseSummary = {
    id: `rel-local-${Date.now()}`,
    userId: "local-user",
    projectId: data.projectId || "proj-1",
    version: data.version,
    title: data.title,
    changelog: data.changelog,
    releaseDate: data.releaseDate || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    projectName: "Project",
  };

  revalidatePath("/developer-hub");
  return { success: true, release: newRelease };
}

export async function connectGitHubAction(username?: string, token?: string) {
  revalidatePath("/developer-hub");
  return { success: true, username, token };
}

export async function disconnectGitHubAction() {
  revalidatePath("/developer-hub");
  return { success: true };
}

export async function connectVercelAction(username?: string, token?: string) {
  revalidatePath("/developer-hub");
  return { success: true, username, token };
}

export async function disconnectVercelAction() {
  revalidatePath("/developer-hub");
  return { success: true };
}

export async function getDevIntegrationAction(): Promise<DevIntegrationSettingSummary> {
  return FALLBACK_DEV_INTEGRATION;
}

export async function updateDevIntegrationAction(data: Partial<DevIntegrationSettingSummary>) {
  revalidatePath("/developer-hub");
  return { success: true, integration: { ...FALLBACK_DEV_INTEGRATION, ...data } };
}

export async function getGitHubDataAction(): Promise<{
  repos: GitHubRepoMetadata[];
  commits: GitHubCommitSummary[];
  prs: GitHubPullRequestSummary[];
  issues: GitHubIssueSummary[];
}> {
  return {
    repos: FALLBACK_GITHUB_REPOS,
    commits: FALLBACK_GITHUB_COMMITS,
    prs: FALLBACK_GITHUB_PRS,
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

export async function triggerLiveSyncAction(target: "GITHUB" | "VERCEL" | "ALL") {
  return { success: true, target, syncedAt: new Date().toISOString() };
}
