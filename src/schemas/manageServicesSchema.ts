import { z } from "zod";

export const serviceSchema = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s\-_]+$/,
      "Invalid characters (allowed: letters, numbers, spaces, hyphens)"
    ),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
