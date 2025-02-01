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

type LogType = "info" | "error" | "warning" | "success";

export interface LogEntry {
  event_id: string;
  deployment_id: string;
  type: LogType;
  message: string;
  timestamp: Date;
}
export interface GetDeploymentLogsResponse {
  logs: LogEntry[];
}

export interface DeploymentResponse {
  status: "string";
  createdAt: Date;
  id: string;
}
export interface GetProjectInfoResponse {
  id: string;
  name: string;
  createdAt: Date;
  gitURL: string;
  subDomain: string;
  userId: string;
  rootDir: string;
  framework: `${SupportedFrameworks}`;
  Deployment: DeploymentResponse[];
}
