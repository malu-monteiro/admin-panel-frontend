import { useState, useEffect } from "react";

import axios from "axios";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { Block } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);

const AdminPanel = () => {
  const [date, setDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);

  const API_URL = "http://localhost:3000";

  const TIMEZONE = "America/Sao_Paulo";

  useEffect(() => {
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
    fetchBlocks();
  }, []);

  const handleBlockSlot = async () => {
    if (!date || !startTime || !endTime) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/blocks`, {
        date: dayjs.tz(date, TIMEZONE).format("YYYY-MM-DD"),
        startTime: dayjs.tz(`${date}T${startTime}`, TIMEZONE).format("HH:mm"),
        endTime: dayjs.tz(`${date}T${endTime}`, TIMEZONE).format("HH:mm"),
      });
      alert("Horário bloqueado com sucesso!");
      window.location.reload();
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
      window.location.reload();
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

      <div className="grid gap-4 mb-8">
        <div>
          <label className="block mb-1">Data</label>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Início</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Fim</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBlockSlot}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Bloquear Horário
          </button>
          <button
            onClick={handleBlockDay}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Bloquear Dia Inteiro
          </button>
        </div>
      </div>

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
