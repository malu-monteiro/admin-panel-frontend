import { z } from "zod";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

export const TIMEZONE = "America/Sao_Paulo";

export const blockSchema = z
  .object({
    date: z.string().min(1, "Please select a date"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      const start = dayjs.tz(`${data.date}T${data.startTime}`, TIMEZONE);
      const end = dayjs.tz(`${data.date}T${data.endTime}`, TIMEZONE);
      return end.isAfter(start);
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type BlockFormValues = z.infer<typeof blockSchema>;
