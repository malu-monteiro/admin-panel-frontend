import { useState, useEffect, useCallback } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import API, { isAxiosError } from "@/lib/api/client";

import { Block, UnblockType, BlockRowProps } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "America/Sao_Paulo";

const toLocalDate = (date: string | Date) => dayjs(date).tz(TIMEZONE);
const currentMonthRange = () => ({
  start: dayjs().tz(TIMEZONE).startOf("month").format("YYYY-MM-DD"),
  end: dayjs().tz(TIMEZONE).endOf("month").format("YYYY-MM-DD"),
});

export function ActiveBlocks() {
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

  return (
    <Card className="p-4 mb-6 max-w-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Time</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <BlockRow
                key={block.id}
                block={block}
                onUnblock={handleUnblock}
                formatTimeSlot={formatTimeSlot}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const BlockRow = ({ block, onUnblock, formatTimeSlot }: BlockRowProps) => (
  <>
    {block.isBlocked ? (
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
    ) : (
      block.blockedSlots?.map((slot) => (
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
      )) ?? null
    )}
  </>
);
