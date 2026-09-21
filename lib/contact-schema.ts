import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "That name is a little long."),
  email: z.email("Enter a valid email address."),
  projectType: z.string().trim().min(1, "Choose a project type."),
  budget: z.string().trim().optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters.")
    .max(2000, "Please keep it under 2000 characters."),
  // Honeypot: silently accepted when empty, ignored when filled.
  company: z.string().optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function fieldErrors(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!map[key]) map[key] = issue.message;
  }
  return map;
}