import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { WorkingHours } from "@/types";

dayjs.extend(timezone);

export const TIMEZONE = "America/Sao_Paulo";

export function getHoursArray(workingHours: WorkingHours | null): string[] {
  if (!workingHours) return [];
  const [start] = workingHours.startTime.split(":").map(Number);
  const [end] = workingHours.endTime.split(":").map(Number);
  return Array.from(
    { length: end - start + 1 },
    (_, i) => `${String(start + i).padStart(2, "0")}:00`
  );
}
