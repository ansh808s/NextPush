import { SupportedFrameworks } from "@/config/constant";

export interface CreateProjectProps {
  name: string;
  gitURL: string;
  framework: `${SupportedFrameworks}`;
  rootDir: string;
}
