import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Block } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);

type Options = {
  timezone?: string;
  blockWeekends?: boolean;
  allowAfterHours?: boolean;
  blockedDates?: Date[]; // for client-side
  blocks?: Block[]; // for admin
};

export function isDateDisabled(
  dateToCheck: Date,
  options: Options = {}
): boolean {
  const {
    timezone = "America/Sao_Paulo",
    blockWeekends = true,
    allowAfterHours = true,
    blockedDates = [],
    blocks = [],
  } = options;

  const now = dayjs().tz(timezone);
  const selected = dayjs(dateToCheck).tz(timezone);

  const isPast = selected.isBefore(now, "day");
  const isWeekend = selected.day() === 0 || selected.day() === 6;
  const isTodayAfterHours = selected.isSame(now, "day") && now.hour() >= 18;

  const isInBlockedDates = blockedDates.some((d) =>
    dayjs(d).tz(timezone).isSame(selected, "day")
  );

  const isInBlocks = blocks.some((block) => {
    const blockDate = dayjs.utc(block.date).tz(timezone);
    return block.isBlocked && blockDate.isSame(selected, "day");
  });

  return (
    isPast ||
    (!allowAfterHours && isTodayAfterHours) ||
    (blockWeekends && isWeekend) ||
    isInBlockedDates ||
    isInBlocks
  );
}
