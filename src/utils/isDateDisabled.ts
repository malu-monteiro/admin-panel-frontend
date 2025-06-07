import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

import type { Block } from "@/types";
import { toLocalDate } from "@/modules/admin/active-blocks/utils/activeBlocks";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const WEEKEND_DAYS = [0, 6];
const AFTER_HOURS_LIMIT = 18;
const DEFAULT_TIMEZONE = "America/Sao_Paulo";

type Options = {
  timezone?: string;
  blockWeekends?: boolean;
  allowAfterHours?: boolean;
  blockedDates?: Date[];
  blocks?: Block[];
};

export function isDateDisabled(
  dateToCheck: Date,
  options: Options = {}
): boolean {
  const {
    blocks = [],
    blockWeekends = true,
    allowAfterHours = true,
    timezone = DEFAULT_TIMEZONE,
  } = options;

  const now = dayjs().tz(timezone);
  const selected = dayjs(dateToCheck).tz(timezone);

  if (selected.isBefore(now, "day")) {
    return true;
  }

  if (blockWeekends && WEEKEND_DAYS.includes(selected.day())) {
    return true;
  }

  if (
    !allowAfterHours &&
    selected.isSame(now, "day") &&
    now.hour() >= AFTER_HOURS_LIMIT
  ) {
    return true;
  }

  if (blocks.length === 0) {
    return false;
  }

  const selectedDayStart = selected.startOf("day");

  for (const block of blocks) {
    const blockDate = toLocalDate(block.date).startOf("day");
    if (!blockDate.isSame(selectedDayStart, "day")) {
      continue;
    }

    if (block.isBlocked) {
      return true;
    }

    if (block.blockedSlots?.length) {
      for (const slot of block.blockedSlots) {
        const start = toLocalDate(`${block.date}T${slot.startTime}`);
        const end = toLocalDate(`${block.date}T${slot.endTime}`);

        if (selected.isBetween(start, end, null, "[)")) {
          return true;
        }
      }
    }
  }

  return false;
}
