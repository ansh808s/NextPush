import z from "zod";
export const createUserSchema = z
  .object({
    code: z.string({ required_error: "Code is required" }),
  })
  .strict();

export const getRepoTreeSchema = z.object({
  sha: z.string({ required_error: "Repository SHA is required" }),
  repo: z.string({ required_error: "Repo name is required" }),
});
