import { z } from "zod";

export const accountSchema = z
  .object({
    name: z.string().min(1, "Required").optional(),
    email: z.string().email().optional(),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z
      .string()
      .optional()
      .refine((pass) => !pass || pass.length >= 6, "Minimum 6 characters"),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && !/(?=.*[A-Za-z])(?=.*\d)/.test(data.newPassword)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must contain letter and number",
        path: ["newPassword"],
      });
    }
    if (data.newPassword || data.confirmPassword) {
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }
      if (!data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Current password is required",
          path: ["currentPassword"],
        });
      }
    }
  });

export type AccountFormData = z.infer<typeof accountSchema>;
