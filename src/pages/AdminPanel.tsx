import { useState, useEffect } from "react";

import axios from "axios";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { Block } from "@/types";

import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

dayjs.extend(utc);
dayjs.extend(timezone);

const AdminPanel = () => {
  const [date, setDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);

  const hours = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, "0")}:00`;
  }).sort((a, b) => a.localeCompare(b));

  const API_URL = "http://localhost:3000";

  const TIMEZONE = "America/Sao_Paulo";

  const fetchBlocks = async () => {
    try {
      const response = await axios.get<Block[]>(`${API_URL}/api/blocks`, {
        params: {
          startDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
          endDate: dayjs().add(1, "month").format("YYYY-MM-DD"),
        },
      });
      setBlocks(response.data);
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
        date: dayjs.tz(date, TIMEZONE).format("YYYY-MM-DD"),
        startTime: dayjs.tz(`${date}T${startTime}`, TIMEZONE).format("HH:mm"),
        endTime: dayjs.tz(`${date}T${endTime}`, TIMEZONE).format("HH:mm"),
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
      if (existingBlock) {
        for (const slot of existingBlock.blockedSlots || []) {
          await axios.delete(`${API_URL}/api/blocks/${slot.id}`);
        }

        if (existingBlock.isBlocked) {
          alert("Dia já está bloqueado.");
          return;
        }
      }

      await axios.post(`${API_URL}/api/blocks`, {
        date: dayjs(date).format("YYYY-MM-DD"),
      });

      alert("Dia bloqueado com sucesso!");
      fetchBlocks();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Erro ao bloquear dia");
      }
    }
  };

  const handleUnblock = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/blocks/${id}`);
      alert("Desbloqueado com sucesso!");
      setBlocks(
        blocks.filter(
          (block) =>
            !(
              block.id === id ||
              block.blockedSlots?.some((slot) => slot.id === id)
            )
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Painel Administrador</h1>

      <Card className="p-4 mb-6 grid gap-4 w-full max-w-md">
        <div>
          <label className="block mb-1">Data</label>
          <Calendar
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={(selectedDate) =>
              setDate(selectedDate?.toISOString().split("T")[0] || null)
            }
            className="rounded-md border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Início</label>
            <Select onValueChange={setStartTime} value={startTime}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar hora" />
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
            <label className="block mb-1">Fim</label>
            <Select onValueChange={setEndTime} value={endTime}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar hora" />
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

        <div className="flex gap-2">
          <Button onClick={handleBlockSlot} aria-label="Bloquear horário">
            Bloquear Horário
          </Button>
          <Button
            variant="destructive"
            onClick={handleBlockDay}
            aria-label="Bloquear dia"
          >
            Bloquear Dia Inteiro
          </Button>
        </div>
      </Card>

      <h2 className="text-xl font-bold mb-2">Bloqueios Ativos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Data</th>
              <th className="py-2 px-4 border">Tipo</th>
              <th className="py-2 px-4 border">Horário</th>
              <th className="py-2 px-4 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => {
              if (block.isBlocked) {
                return (
                  <tr key={`day-${block.id}`}>
                    <td className="py-2 px-4 border">
                      {dayjs.utc(block.date).format("DD/MM/YYYY")}
                    </td>
                    <td className="py-2 px-4 border">Dia Inteiro</td>
                    <td className="py-2 px-4 border">-</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleUnblock(block.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              }

              if (block.blockedSlots && block.blockedSlots.length > 0) {
                return block.blockedSlots.map((slot) => (
                  <tr key={`slot-${slot.id}`}>
                    <td className="py-2 px-4 border">
                      {dayjs(slot.startTime).format("DD/MM/YYYY")}
                    </td>
                    <td className="py-2 px-4 border">Horário</td>
                    <td className="py-2 px-4 border">
                      {dayjs
                        .utc(slot.startTime)
                        .tz("America/Sao_Paulo")
                        .format("HH:mm")}
                      -{" "}
                      {dayjs
                        .utc(slot.endTime)
                        .tz("America/Sao_Paulo")
                        .format("HH:mm")}
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleUnblock(slot.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ));
              }

              return null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
