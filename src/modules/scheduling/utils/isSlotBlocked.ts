import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import type { Block } from "@/types";

dayjs.extend(isBetween);

export function isSlotBlocked(
  date: Date,
  time: string,
  blocks: Block[],
  timezone: string
): boolean {
  const blocksOfDay = blocks.filter((block) =>
    dayjs(block.date).tz(timezone).isSame(dayjs(date).tz(timezone), "day")
  );

  return blocksOfDay.some((block) =>
    (block.blockedSlots || []).some((slot) => {
      const slotTime = dayjs(`2000-01-01 ${time}`);
      const blockStart = dayjs(`2000-01-01 ${slot.startTime}`);
      const blockEnd = dayjs(`2000-01-01 ${slot.endTime}`);

      return slotTime.isBetween(blockStart, blockEnd, null, "[]");
    })
  );
}
