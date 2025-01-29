import { SupportedFrameworks } from "@/config/constant";
import { z } from "zod";
export const formSchema = z.object({
  name: z.string().min(1, "Project Name is required"),
  framework: z.nativeEnum(SupportedFrameworks, {
    invalid_type_error: "Framework is not supported",
  }),
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
