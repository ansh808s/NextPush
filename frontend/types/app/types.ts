import { SupportedFrameworks } from "@/config/constant";

export interface CreateProjectProps {
  name: string;
  gitURL: string;
  framework: `${SupportedFrameworks}`;
  rootDir: string;
}

export interface CreateProjectResponse {
  project: string;
  name: string;
  framework: `${SupportedFrameworks}`;
  rootDir: string;
  subDomain: string;
  slug: string;
  url: string;
}

export interface CreateDeploymentProps {
  projectId: string;
}

export enum DeploymentStatus {
  NotStarted = "not started",
  Queued = "queued",
  InProgress = "in progress",
  Ready = "ready",
  Failed = "failed",
}
export interface CreateDeploymentResponse {
  url: string;
  deploymentId: string;
  status: DeploymentStatus;
}
