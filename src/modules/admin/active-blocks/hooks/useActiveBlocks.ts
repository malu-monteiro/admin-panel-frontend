import { useState, useEffect, useCallback } from "react";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { toast } from "sonner";

import type { Block, UnblockType } from "@/types";

import API, { isAxiosError } from "@/lib/api/client";

import {
  currentMonthRange,
  TIMEZONE,
  toLocalDate,
} from "../utils/activeBlocks";

dayjs.extend(isSameOrAfter);

export function useActiveBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const fetchBlocks = useCallback(async () => {
    try {
      const { start, end } = currentMonthRange();
      const { data } = await API.get<Block[]>("/availability/blocks", {
        params: { startDate: start, endDate: end },
      });

      const isFutureBlock = (block: Block) => {
        const now = dayjs().tz(TIMEZONE);
        const blockDate = toLocalDate(block.date).startOf("day");

        if (blockDate.isBefore(now.startOf("day"))) {
          return false;
        }

        if (block.isBlocked) {
          return true;
        }

        return (
          block.blockedSlots?.some((slot) => {
            const slotEndTime = blockDate
              .clone()
              .set("hour", parseInt(slot.endTime.split(":")[0]))
              .set("minute", parseInt(slot.endTime.split(":")[1]));
            return (
              blockDate.isAfter(now.startOf("day")) || slotEndTime.isAfter(now)
            );
          }) ?? false
        );
      };

      setBlocks(data.filter(isFutureBlock));
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error ?? "Failed to load blocks"
        : "Failed to load blocks";
      toast.error(message);
      setBlocks([]);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleUnblock = useCallback(
    async (type: UnblockType, id: number) => {
      try {
        await API.delete(`/availability/blocks/${type}/${id}`);
        await fetchBlocks();
        toast.success("Successfully unblocked");
      } catch (error) {
        const message = isAxiosError(error)
          ? error.response?.data?.error ?? "Failed to unblock"
          : "An error occurred while trying to unblock";
        toast.error(message);
      }
    },
    [fetchBlocks]
  );

  const formatTimeSlot = (
    date: string | Date,
    start?: string,
    end?: string
  ) => {
    if (!start || !end) return "-";

    const dayjsDate = toLocalDate(date).startOf("day");

    const format = (time: string) => {
      return dayjsDate
        .clone()
        .set("hour", parseInt(time.split(":")[0]))
        .set("minute", parseInt(time.split(":")[1]))
        .format("HH:mm");
    };

    return `${format(start)} - ${format(end)}`;
  };
  return {
    blocks,
    handleUnblock,
    formatTimeSlot,
  };
}
