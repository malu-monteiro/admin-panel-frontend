import type { BlockRowProps } from "@/types";

import { Button } from "@/components/ui/button";

import { toLocalDate } from "./utils/activeBlocks";

export function BlockRow({ block, onUnblock, formatTimeSlot }: BlockRowProps) {
  if (block.isBlocked) {
    return (
      <tr className="border-b">
        <td className="py-2 px-4">
          {toLocalDate(block.date).format("DD/MM/YYYY")}
        </td>
        <td className="py-2 px-4">All Day</td>
        <td className="py-2 px-4">-</td>
        <td className="py-2 px-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onUnblock("day", block.id)}
          >
            Remove
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <>
      {block.blockedSlots?.map((slot) => (
        <tr key={slot.id} className="border-b">
          <td className="py-2 px-4">
            {toLocalDate(block.date).format("DD/MM/YYYY")}
          </td>
          <td className="py-2 px-4">Time Slot</td>
          <td className="py-2 px-4">
            {formatTimeSlot(block.date, slot.startTime, slot.endTime)}
          </td>
          <td className="py-2 px-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onUnblock("slot", slot.id)}
            >
              Remove
            </Button>
          </td>
        </tr>
      )) ?? null}
    </>
  );
}
