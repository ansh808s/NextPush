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

export interface UserResponse {
  id: string;
  avatarUrl: string;
  username: string;
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
  user: UserResponse;
}
export const deploymentResponseStatus = {
  NOT_STARTED: { label: "Not Started", color: "text-gray-500" },
  QUEUED: { label: "Queued", color: "text-blue-500" },
  IN_PROGRESS: { label: "In Progress", color: "text-yellow-500" },
  READY: { label: "Ready", color: "text-green-500" },
  FAILED: { label: "Failed", color: "text-red-500" },
} as const;

export type DeploymentStatusFromApi = keyof typeof deploymentResponseStatus;

export interface GetSiteVisitsProps {
  type: string;
  id: string;
}

export interface GetSiteVisitsResponse {
  visits: number;
}
