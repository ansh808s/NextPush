import z from "zod";
import { SupportedFrameworks } from "../../config/constants";

export const createProjectSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .max(20, "Name shouldn't be more than 20 characters"),
  gitURL: z
    .string({ required_error: "Git URL is required" })
    .url({ message: "Please provide a valid URL" }),
  framework: z.nativeEnum(SupportedFrameworks, {
    required_error: "Framework is required",
    invalid_type_error: "Framework is not supported",
  }),
  rootDir: z.string({ required_error: "Root directory is required" }),
});

export const createDeploymentSchema = z.object({
  projectId: z.string({ required_error: "Project ID is required" }),
});
