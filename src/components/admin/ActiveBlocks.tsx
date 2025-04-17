import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Block } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);

export function ActiveBlocks() {
  const API_URL = "http://localhost:3000";
  const TIMEZONE = "America/Sao_Paulo";

  const [blocks, setBlocks] = useState<Block[]>([]);

  const fetchBlocks = async () => {
    try {
      const response = await axios.get<Block[]>(`${API_URL}/api/blocks`, {
        params: {
          startDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
          endDate: dayjs().add(1, "month").format("YYYY-MM-DD"),
        },
      });
      const isFutureBlock = (block: Block) => {
        const now = dayjs().tz(TIMEZONE);

        if (block.isBlocked) {
          const blockDate = dayjs(block.date).tz(TIMEZONE).startOf("day");
          return blockDate.isSameOrAfter(now.startOf("day"));
        }

        if (block.blockedSlots?.length) {
          return block.blockedSlots.some((slot) =>
            dayjs(slot.endTime).tz(TIMEZONE).isAfter(now)
          );
        }

        return false;
      };

      const filteredBlocks = response.data.filter(isFutureBlock);
      setBlocks(filteredBlocks);
    } catch (error) {
      console.error("Erro ao buscar bloqueios:", error);
      setBlocks([]);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleUnblock = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/blocks/${id}`);
      await fetchBlocks();
      alert("Desbloqueado com sucesso!");
      setBlocks((prevBlocks) =>
        prevBlocks.filter(
          (block) =>
            block.id !== id &&
            !block.blockedSlots?.some((slot) => slot.id === id)
        )
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Erro ao desbloquear");
      } else {
        alert("Erro ao desbloquear");
      }
    }
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
            {blocks
              .filter((block) => block.isBlocked || block.blockedSlots?.length)
              .flatMap((block) => {
                if (block.isBlocked) {
                  return (
                    <tr key={`day-${block.id}`} className="border-b">
                      <td className="py-2 px-4">
                        {dayjs
                          .utc(block.date)
                          .tz(TIMEZONE)
                          .format("DD/MM/YYYY")}
                      </td>
                      <td className="py-2 px-4">All Day</td>
                      <td className="py-2 px-4">-</td>
                      <td className="py-2 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUnblock(block.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                }
                return (
                  block.blockedSlots?.map((slot) => (
                    <tr key={`slot-${slot.id}`} className="border-b">
                      <td className="py-2 px-4">
                        {dayjs
                          .utc(slot.startTime)
                          .tz(TIMEZONE)
                          .format("DD/MM/YYYY")}
                      </td>
                      <td className="py-2 px-4">Horário</td>
                      <td className="py-2 px-4">
                        {dayjs.utc(slot.startTime).tz(TIMEZONE).format("HH:mm")}
                        - {dayjs.utc(slot.endTime).tz(TIMEZONE).format("HH:mm")}
                      </td>
                      <td className="py-2 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUnblock(slot.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  )) || []
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
