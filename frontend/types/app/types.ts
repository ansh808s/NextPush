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
