import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isDateDisabled } from "@/utils/isDateDisabled";
import { WorkingHours, Block } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);

export function ManageDates() {
  const API_URL = "http://localhost:3000";
  const TIMEZONE = "America/Sao_Paulo";

  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const loadWorkingHours = async () => {
      try {
        const response = await axios.get<WorkingHours>(
          `${API_URL}/api/working-hours`
        );
        setWorkingHours({ ...response.data, isDefault: false });
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
        setWorkingHours({
          startTime: "08:00",
          endTime: "18:00",
          isDefault: true,
        });
      }
    };
    loadWorkingHours();
  }, []);

  const hours = useMemo(() => {
    if (!workingHours) return [];
    const [startHour] = workingHours.startTime.split(":").map(Number);
    const [endHour] = workingHours.endTime.split(":").map(Number);
    const timeSlots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return timeSlots;
  }, [workingHours]);

  const fetchBlocks = async () => {
    try {
      const response = await axios.get<Block[]>(`${API_URL}/api/blocks`, {
        params: {
          startDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
          endDate: dayjs().add(1, "month").format("YYYY-MM-DD"),
        },
      });

      const now = dayjs().tz(TIMEZONE);
      const isFutureBlock = (block: Block) => {
        if (block.isBlocked) {
          const blockDate = dayjs(block.date).tz(TIMEZONE).startOf("day");
          return blockDate.isSameOrAfter(now.startOf("day"));
        }
        return (
          block.blockedSlots?.some((slot) =>
            dayjs(slot.endTime).tz(TIMEZONE).isAfter(now)
          ) ?? false
        );
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

  const handleBlockSlot = async () => {
    if (!date || !startTime || !endTime) {
      alert("Preencha todos os campos.");
      return;
    }
    if (startTime >= endTime) {
      alert("O horário de início deve ser menor que o de fim.");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/blocks`, {
        date: dayjs(date, TIMEZONE).format("YYYY-MM-DD"),
        startTime: dayjs(`${date}T${startTime}`, TIMEZONE).toISOString(),
        endTime: dayjs(`${date}T${endTime}`, TIMEZONE).toISOString(),
      });
      alert("Horário bloqueado com sucesso!");
      fetchBlocks();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Erro ao bloquear horário");
      } else {
        alert("Erro ao bloquear horário");
      }
    }
  };

  const handleBlockDay = async () => {
    if (!date) {
      alert("Selecione uma data.");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/api/blocks`, {
        params: {
          startDate: dayjs(date).format("YYYY-MM-DD"),
          endDate: dayjs(date).format("YYYY-MM-DD"),
        },
      });

      const existingBlock = res.data[0];
      if (existingBlock?.isBlocked) {
        alert("Dia já está bloqueado.");
        return;
      }
      if (existingBlock) {
        for (const slot of existingBlock.blockedSlots || []) {
          await axios.delete(`${API_URL}/api/blocks/${slot.id}`);
        }
      }

      await axios.post(`${API_URL}/api/blocks`, {
        date: dayjs(date).format("YYYY-MM-DD"),
        isBlocked: true,
      });
      alert("Dia bloqueado com sucesso!");
      fetchBlocks();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Erro ao bloquear dia");
      }
    }
  };

  return (
    <Card className="p-4 mb-6 grid gap-4 w-full max-w-md">
      <div>
        <Calendar
          mode="single"
          selected={date ? new Date(date) : undefined}
          onSelect={(selectedDate) =>
            setDate(selectedDate?.toISOString().split("T")[0] || null)
          }
          disabled={(dateItem) =>
            isDateDisabled(dateItem, {
              blocks,
              allowAfterHours: false,
            })
          }
          className="rounded-md border"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="block mb-1">Start</Label>
          <Select onValueChange={setStartTime} value={startTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select Time" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block mb-1">End</Label>
          <Select onValueChange={setEndTime} value={endTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select Time" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={handleBlockSlot} className="w-[160px]">
          Block Time Slot
        </Button>
        <Button
          variant="destructive"
          onClick={handleBlockDay}
          className="w-[160px]"
        >
          Block Entire Day
        </Button>
      </div>
    </Card>
  );
}
