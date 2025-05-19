import { useState, useEffect } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { Block } from "@/types";

import API, { isAxiosError } from "@/lib/api/client";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "America/Sao_Paulo";

export function ActiveBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const toLocalDate = (date: string | Date) => {
    return dayjs(date).tz(TIMEZONE);
  };

  const fetchBlocks = async () => {
    try {
      const startDate = dayjs()
        .tz(TIMEZONE)
        .startOf("month")
        .format("YYYY-MM-DD");
      const endDate = dayjs().tz(TIMEZONE).endOf("month").format("YYYY-MM-DD");

      const response = await API.get<Block[]>("/availability/blocks", {
        params: {
          startDate,
          endDate,
        },
      });

      const isFutureBlock = (block: Block) => {
        const now = dayjs().tz(TIMEZONE);

        if (block.isBlocked) {
          const blockDate = toLocalDate(block.date).startOf("day");
          return blockDate.isSameOrAfter(now.startOf("day"));
        }

        return (
          block.blockedSlots?.some((slot) => {
            const localDate = toLocalDate(block.date).format("YYYY-MM-DD");
            const slotEnd = dayjs.tz(`${localDate}T${slot.endTime}`, TIMEZONE);
            return slotEnd.isAfter(now);
          }) ?? false
        );
      };

      const filteredBlocks = response.data.filter(isFutureBlock);
      setBlocks(filteredBlocks);
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error
        : "Failed to load blocks";
      toast.error(message);
      setBlocks([]);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleUnblock = async (type: "day" | "slot", id: number) => {
    try {
      await API.delete(`/availability/blocks/${type}/${id}`);
      await fetchBlocks();
      toast.success("Successfully unblocked");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error
        : "An error occurred while trying to unblock";
      toast.error(message);
    }
  };

  const formatDateTime = (date: string | Date, time?: string) => {
    if (!time) return toLocalDate(date).format("DD/MM/YYYY");

    const localDate = toLocalDate(date).format("YYYY-MM-DD");
    return dayjs.tz(`${localDate}T${time}`, TIMEZONE).format("HH:mm");
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
            {blocks.map((block) =>
              block.isBlocked ? (
                <tr key={`day-${block.id}`} className="border-b">
                  <td className="py-2 px-4">
                    {toLocalDate(block.date).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-2 px-4">All Day</td>
                  <td className="py-2 px-4">-</td>
                  <td className="py-2 px-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUnblock("day", block.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ) : (
                block.blockedSlots?.map((slot) => (
                  <tr key={`slot-${slot.id}`} className="border-b">
                    <td className="py-2 px-4">
                      {toLocalDate(block.date).format("DD/MM/YYYY")}
                    </td>
                    <td className="py-2 px-4">Time Slot</td>
                    <td className="py-2 px-4">
                      {`${formatDateTime(
                        block.date,
                        slot.startTime
                      )} - ${formatDateTime(block.date, slot.endTime)}`}
                    </td>
                    <td className="py-2 px-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUnblock("slot", slot.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                )) || []
              )
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
