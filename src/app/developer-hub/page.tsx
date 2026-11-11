import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DeveloperHubExperience } from "@/components/developer/developer-hub-experience";
import {
  getDeveloperHubMetricsAction,
  getProjectsAction,
  getDevBugsAction,
  getDevFeaturesAction,
  getDevDocsAction,
  getDevDeploymentsAction,
  getDevReleasesAction,
  getDevIntegrationAction,
  getGitHubDataAction,
  getVercelDataAction,
} from "@/server/actions/developer";

export const metadata = {
  title: "Developer Hub | XASAN OS Ultimate",
  description:
    "Ecosystem management for core ventures: Aurelius IELTS, LinguaHub, Ravon Auto Tuning, and 36-School LMS.",
};

export default async function DeveloperHubPage() {
  const [
    metrics,
    projects,
    bugs,
    features,
    docs,
    deployments,
    releases,
    integration,
    githubData,
    vercelData,
  ] = await Promise.all([
    getDeveloperHubMetricsAction(),
    getProjectsAction(),
    getDevBugsAction(),
    getDevFeaturesAction(),
    getDevDocsAction(),
    getDevDeploymentsAction(),
    getDevReleasesAction(),
    getDevIntegrationAction(),
    getGitHubDataAction(),
    getVercelDataAction(),
  ]);

  return (
    <AppShell>
      <DeveloperHubExperience
        metrics={metrics}
        projects={projects}
        bugs={bugs}
        features={features}
        docs={docs}
        deployments={deployments}
        releases={releases}
        integration={integration}
        githubRepos={githubData.repos}
        githubCommits={githubData.commits}
        githubPRs={githubData.prs}
        githubIssues={githubData.issues}
        vercelProjects={vercelData.projects}
        vercelDeployments={vercelData.deployments}
      />
    </AppShell>
  );
}
