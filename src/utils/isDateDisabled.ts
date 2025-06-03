import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

import type { Block } from "@/types";
import { toLocalDate } from "@/modules/admin/active-blocks/utils/activeBlocks";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

type Options = {
  timezone?: string;
  blockWeekends?: boolean;
  allowAfterHours?: boolean;
  blockedDates?: Date[]; // for user-side
  blocks?: Block[]; // for admin
};

export function isDateDisabled(
  dateToCheck: Date,
  options: Options = {}
): boolean {
  const {
    blocks = [],
    blockWeekends = true,
    allowAfterHours = true,
    timezone = "America/Sao_Paulo",
  } = options;

  const now = dayjs().tz(timezone);
  const selected = dayjs(dateToCheck).tz(timezone);

  const isPast = selected.isBefore(now, "day");
  const isWeekend =
    blockWeekends && (selected.day() === 0 || selected.day() === 6);
  const isTodayAfterHours =
    !allowAfterHours && selected.isSame(now, "day") && now.hour() >= 18;

  const isBlocked = blocks.some((block) => {
    const blockDate = toLocalDate(block.date).startOf("day");

    if (block.isBlocked && blockDate.isSame(selected, "day")) {
      return true;
    }

    return (
      block.blockedSlots?.some((slot) => {
        const start = toLocalDate(`${block.date}T${slot.startTime}`);
        const end = toLocalDate(`${block.date}T${slot.endTime}`);

        return selected.isBetween(start, end, null, "[)");
      }) || false
    );
  });

  return isPast || isTodayAfterHours || isWeekend || isBlocked;
}
