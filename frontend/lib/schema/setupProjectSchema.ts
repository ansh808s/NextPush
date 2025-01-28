import { z } from "zod";
export const formSchema = z.object({
  projectName: z.string().min(1, "Project Name is required"),
  framework: z.string().min(1, "Please select a framework"),
  envVars: z
    .array(
      z.object({
        key: z.string().optional(),
        value: z.string().optional(),
      })
    )
    .optional(),
  rootDir: z.string(),
});

export type SetupProjectFormData = z.infer<typeof formSchema>;
