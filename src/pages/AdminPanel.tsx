import { useState, useEffect, useCallback, useMemo } from "react";

import axios from "axios";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { isDateDisabled } from "@/utils/isDateDisabled";

import { Block, WorkingHours } from "@/types";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

export function AdminPanel() {
  const API_URL = "http://localhost:3000";
  const TIMEZONE = "America/Sao_Paulo";
  const SERVICE_NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/;
  const MIN_SERVICE_NAME_LENGTH = 3;
  const MAX_SERVICE_NAME_LENGTH = 50;

  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);

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

  const isValidName = (name: string) => {
    return (
      name.trim().length >= MIN_SERVICE_NAME_LENGTH &&
      name.trim().length <= MAX_SERVICE_NAME_LENGTH &&
      SERVICE_NAME_REGEX.test(name.trim())
    );
  };

  useEffect(() => {
    const loadWorkingHours = async () => {
      try {
        const response = await axios.get<WorkingHours>(
          `${API_URL}/api/working-hours`
        );
        setWorkingHours({
          ...response.data,
          isDefault: false,
        });
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

  const handleSaveWorkingHours = async () => {
    if (!workingHours) return;

    try {
      const response = await axios.post(`${API_URL}/api/working-hours`, {
        startTime: workingHours.startTime,
        endTime: workingHours.endTime,
      });

      setWorkingHours({
        ...response.data,
        isDefault: false,
      });

      alert("Horários atualizados com sucesso!");
      setIsEditingHours(false);
    } catch (error) {
      let errorMessage = "Erro ao atualizar horários";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
        if (error.response?.data?.details) {
          errorMessage += `: ${error.response.data.details}`;
        }
      }
      alert(errorMessage);
      console.error("Erro completo:", error);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    };

    fetchServices();
  }, []);

  const fetchBlocks = useCallback(async () => {
    try {
      const response = await axios.get<Block[]>(`${API_URL}/api/blocks`, {
        params: {
          startDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
          endDate: dayjs().add(1, "month").format("YYYY-MM-DD"),
        },
      });
      const filteredBlocks = response.data.filter(isFutureBlock);
      setBlocks(filteredBlocks);
    } catch (error) {
      console.error("Erro ao buscar bloqueios:", error);
      setBlocks([]);
    }
  }, []);

  const handleAddService = async () => {
    const trimmedName = newServiceName.trim();

    const duplicatedName = services.some(
      (s) => s.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicatedName) {
      alert("Este serviço já foi adicionado!");
      return;
    }

    if (!newServiceName.trim()) {
      alert("Por favor, insira um nome para o serviço.");
      return;
    }

    if (!isValidName(newServiceName)) {
      alert(`Nome inválido. Deve:
        - Ter entre ${MIN_SERVICE_NAME_LENGTH} e ${MAX_SERVICE_NAME_LENGTH} caracteres.
        - Conter apenas letras e espaços.`);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/services`, {
        name: newServiceName.trim(),
      });

      setServices([...services, response.data]);
      setNewServiceName("");
      alert("Serviço adicionado com sucesso!");
    } catch (error) {
      let errorMessage = "Erro ao adicionar serviço";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      alert(errorMessage);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este serviço?")) return;

    try {
      await axios.delete(`${API_URL}/api/services/${id}`);
      setServices(services.filter((s) => s.id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Erro ao remover serviço");
      }
    }
  };

  const isFutureBlock = (block: Block) => {
    const now = dayjs().tz(TIMEZONE);

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
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-4xl p-6 mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Painel Administrador
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Horário de Funcionamento</h2>
            <Card className="p-4 mb-6 w-full max-w-md">
              {isEditingHours ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block mb-1">Abertura</Label>
                      <Select
                        onValueChange={(value) =>
                          setWorkingHours((prev) =>
                            prev ? { ...prev, startTime: value } : null
                          )
                        }
                        value={workingHours?.startTime || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar hora" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return [`${hour}:00`, `${hour}:30`];
                          })
                            .flat()
                            .map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block mb-1">Fechamento</Label>
                      <Select
                        onValueChange={(value) =>
                          setWorkingHours((prev) =>
                            prev ? { ...prev, endTime: value } : null
                          )
                        }
                        value={workingHours?.endTime || ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar hora" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return [`${hour}:00`, `${hour}:30`];
                          })
                            .flat()
                            .map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveWorkingHours}>Salvar</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingHours(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {workingHours?.startTime || "08:00"}-{" "}
                      {workingHours?.endTime || "18:00"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Horário padrão de funcionamento
                    </p>
                  </div>
                  <Button onClick={() => setIsEditingHours(true)}>
                    Editar
                  </Button>
                </div>
              )}
            </Card>

            <h2 className="text-xl font-bold mb-4">Gerenciar Serviços</h2>

            <Card className="p-4 mb-6">
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Nome do novo serviço"
                />
                <Button onClick={handleAddService}>Adicionar</Button>
              </div>

              <ul className="border rounded divide-y">
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="p-3 flex justify-between items-center"
                  >
                    <span>{service.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <XIcon className="w-5 h-5 text-white" />
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>

            <h2 className="text-xl font-bold mb-4">Gerenciar Datas</h2>
            <Card className="p-4 mb-6 grid gap-4 w-full max-w-md">
              <div>
                <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={(selectedDate) =>
                    setDate(selectedDate?.toISOString().split("T")[0] || null)
                  }
                  disabled={(date) =>
                    isDateDisabled(date, {
                      blocks,
                      allowAfterHours: false,
                    })
                  }
                  className="rounded-md border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-1">Início</Label>
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
                  <Label className="block mb-1">Fim</Label>
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
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Data</th>
                      <th className="py-2 px-4 text-left">Tipo</th>
                      <th className="py-2 px-4 text-left">Horário</th>
                      <th className="py-2 px-4 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blocks.map((block) => {
                      if (block.isBlocked) {
                        return (
                          <tr key={`day-${block.id}`} className="border-b">
                            <td className="py-2 px-4">
                              {dayjs.utc(block.date).format("DD/MM/YYYY")}
                            </td>
                            <td className="py-2 px-4">Dia Inteiro</td>
                            <td className="py-2 px-4">-</td>
                            <td className="py-2 px-4">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleUnblock(block.id)}
                              >
                                Remover
                              </Button>
                            </td>
                          </tr>
                        );
                      }

                      if (block.blockedSlots && block.blockedSlots.length > 0) {
                        return block.blockedSlots.map((slot) => (
                          <tr key={`slot-${slot.id}`} className="border-b">
                            <td className="py-2 px-4">
                              {dayjs(slot.startTime).format("DD/MM/YYYY")}
                            </td>
                            <td className="py-2 px-4">Horário</td>
                            <td className="py-2 px-4">
                              {dayjs
                                .utc(slot.startTime)
                                .tz(TIMEZONE)
                                .format("HH:mm")}
                              -{" "}
                              {dayjs
                                .utc(slot.endTime)
                                .tz(TIMEZONE)
                                .format("HH:mm")}
                            </td>
                            <td className="py-2 px-4">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleUnblock(slot.id)}
                              >
                                Remover
                              </Button>
                            </td>
                          </tr>
                        ));
                      }

                      return null;
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
