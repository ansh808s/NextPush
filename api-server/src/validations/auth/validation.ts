import z from "zod";
export const createUserSchema = z
  .object({
    code: z.string({ required_error: "Code is required" }),
  })
  .strict();
