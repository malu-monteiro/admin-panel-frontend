import { useState, useEffect, useCallback } from "react";

import dayjs from "dayjs";

import {
  currentMonthRange,
  TIMEZONE,
  toLocalDate,
} from "@/utils/active-blocks";

import { toast } from "sonner";

import { Block, UnblockType } from "@/types";

import API, { isAxiosError } from "@/lib/api/client";

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
        return block.isBlocked
          ? toLocalDate(block.date)
              .startOf("day")
              .isSameOrAfter(now.startOf("day"))
          : block.blockedSlots?.some((slot) =>
              dayjs.tz(`${block.date}T${slot.endTime}`, TIMEZONE).isAfter(now)
            ) ?? false;
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
    const format = (time: string) =>
      toLocalDate(`${date}T${time}`).format("HH:mm");
    return `${format(start)} - ${format(end)}`;
  };

  return {
    blocks,
    handleUnblock,
    formatTimeSlot,
  };
}
