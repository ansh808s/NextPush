import z from "zod";

export const createProjectSchema = z.object({
  name: z.string().max(20, "Name shouldn't be more than 20 characters"),
  gitURL: z.string({ required_error: "Git URL is required" }),
});

export const createDeploymentSchema = z.object({
  projectId: z.string({ required_error: "Project ID is required" }),
});
