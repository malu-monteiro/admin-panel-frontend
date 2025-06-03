import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const step1Schema = z.object({
  service: z.string().min(1, "Please select a service"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
});

export const step2Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().optional(),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type AppointmentData = Step1Data & Step2Data;

export const step1Resolver = zodResolver(step1Schema);
export const step2Resolver = zodResolver(step2Schema);
