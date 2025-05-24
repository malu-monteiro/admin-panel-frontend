import { z } from "zod";

export const step1Schema = z.object({
  service: z.string().min(1, "Please select a service"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
});

export const step2Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  phone: z
    .string()
    .min(14, "Invalid phone number")
    .max(15, "Invalid phone number"),
  message: z.string().optional(),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
