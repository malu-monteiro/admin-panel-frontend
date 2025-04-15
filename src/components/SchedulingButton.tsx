import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Availability, AppointmentData } from "@/types";

import { isDateDisabled } from "@/utils/isDateDisabled";

dayjs.extend(utc);
dayjs.extend(isBetween);

const API_URL = "http://localhost:3000";

const step1Schema = z.object({
  service: z.string().min(1, "Por favor, selecione um serviço"),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  time: z.string().min(1, "Por favor, selecione um horário"),
});

const step2Schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(14, "Telefone inválido").max(15, "Telefone inválido"),
  message: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

export function SchedulingButton() {
  const [workingHours, setWorkingHours] = useState<{
    startTime: "08:00";
    endTime: "18:00";
    isDefault?: boolean;
  } | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeBlocks, setTimeBlocks] = useState<
    Array<{
      date: string;
      startTime: string;
      endTime: string;
    }>
  >([]);

  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/working-hours`);
        setWorkingHours({
          ...response.data,
          isDefault: false,
        });
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
        setWorkingHours({
          startTime: "08:00",
          endTime: "18:00",
          isDefault: true,
        });
      }
    };

    fetchWorkingHours();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/services`);
        setServices(response.data.map((s: { name: string }) => s.name));
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);

        setServices([
          "Healthcare",
          "Daycare",
          "Training",
          "Pet Grooming",
          "Hygienic care",
        ]);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await axios.get<Availability[]>(
          `${API_URL}/api/blocks`,
          {
            params: {
              startDate: dayjs().utc().format("YYYY-MM-DD"),
              endDate: dayjs().utc().add(3, "month").format("YYYY-MM-DD"),
            },
          }
        );

        const fullyBlockedDates = response.data
          .filter((block) => block.isBlocked === true)
          .map((block) => {
            const localDate = dayjs.utc(block.date).local().toDate();
            return localDate;
          });

        const timeBlocksData = response.data
          .filter((block) => !block.isBlocked && block.blockedSlots)
          .flatMap(
            (block) =>
              block.blockedSlots?.map((slot) => ({
                date: dayjs.utc(slot.startTime).local().format("YYYY-MM-DD"),
                startTime: dayjs.utc(slot.startTime).local().format("HH:mm"),
                endTime: dayjs.utc(slot.endTime).local().format("HH:mm"),
              })) || []
          );

        setBlockedDates(fullyBlockedDates);
        setTimeBlocks(timeBlocksData);
      } catch (error) {
        console.error("Erro ao buscar bloqueios:", error);
      }
    };

    fetchBlockedDates();
  }, []);

  useEffect(() => {
    if (!selectedDate || !workingHours) {
      setAvailableTimes([]);
      return;
    }

    const generateAvailableTimes = () => {
      if (!selectedDate || !workingHours) return [];

      const [startHour] = workingHours.startTime.split(":").map(Number);
      const [endHour, endMinute] = workingHours.endTime.split(":").map(Number);

      const times: string[] = [];
      const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");
      const dayTimeBlocks = timeBlocks.filter(
        (block) => block.date === dateStr
      );

      const totalSlots = endHour - startHour + (endMinute > 0 ? 1 : 0);

      for (let i = 0; i < totalSlots; i++) {
        const currentHour = startHour + i;
        const timeString = `${currentHour.toString().padStart(2, "0")}:00`;

        const isBlocked = dayTimeBlocks.some((block) => {
          const slotTime = dayjs(`2000-01-01 ${timeString}`);
          const blockStart = dayjs(`2000-01-01 ${block.startTime}`);
          const blockEnd = dayjs(`2000-01-01 ${block.endTime}`);

          return slotTime.isBetween(blockStart, blockEnd, null, "[]");
        });

        if (!isBlocked) {
          times.push(timeString);
        }
      }

      return times;
    };

    setAvailableTimes(generateAvailableTimes());
  }, [selectedDate, timeBlocks, workingHours]);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    shouldUnregister: true,
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  });

  const handleStep1Submit = () => {
    setStep(2);
  };

  const handleStep2Submit = async (data: Step2Data) => {
    try {
      setLoading(true);

      const step1Data = step1Form.getValues();
      const appointmentData: AppointmentData = {
        service: step1Data.service,
        date: dayjs(step1Data.date).utc().format("YYYY-MM-DD"),
        time: step1Data.time,
        name: data.name,
        phone: data.phone,
        message: data.message,
      };

      await axios.post(`${API_URL}/api/appointments`, appointmentData);

      toast.success("Agendamento realizado com sucesso!");

      setOpen(false);
      setStep(1);
      step1Form.reset();
      step2Form.reset();
    } catch (error) {
      let errorMessage = "Ocorreu um erro ao agendar.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (value.length > 0) {
      formattedValue = `(${value.substring(0, 2)}`;
      if (value.length > 2) {
        formattedValue += `) ${value.substring(2, 7)}`;
        if (value.length > 7) {
          formattedValue += `-${value.substring(7, 11)}`;
        }
      }
    }

    step2Form.setValue("phone", formattedValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="custom">Schedule a Service</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1
              ? "Solicite o agendamento de um serviço"
              : "Informações adicionais"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Selecione o serviço e horário desejado"
              : "Preencha seus dados para concluir o agendamento"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <form
            onSubmit={step1Form.handleSubmit(handleStep1Submit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Selecione um serviço
              </label>
              <Select
                onValueChange={(value) => {
                  step1Form.setValue("service", value);
                  step1Form.trigger("service");
                }}
                value={step1Form.watch("service")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {step1Form.formState.errors.service && (
                <p className="text-sm text-red-500 mt-1">
                  {step1Form.formState.errors.service.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Selecione uma data
              </label>
              <Calendar
                mode="single"
                selected={step1Form.watch("date")}
                onSelect={(date) => {
                  if (date) {
                    const localDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );
                    step1Form.setValue("date", localDate);
                    step1Form.trigger("date");
                    setSelectedDate(localDate);
                  }
                }}
                disabled={(date) =>
                  isDateDisabled(date, {
                    blockedDates,
                    allowAfterHours: false,
                  })
                }
                className="rounded-md border"
              />
              {step1Form.formState.errors.date && (
                <p className="text-sm text-red-500 mt-1">
                  {step1Form.formState.errors.date.message}
                </p>
              )}
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Selecione um horário
                </label>
                <Select
                  onValueChange={(value) => {
                    step1Form.setValue("time", value);
                    step1Form.trigger("time");
                  }}
                  value={step1Form.watch("time")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {step1Form.formState.errors.time && (
                  <p className="text-sm text-red-500 mt-1">
                    {step1Form.formState.errors.time.message}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full hover:bg-accent hover:text-muted-foreground "
              disabled={!step1Form.formState.isValid}
            >
              Continuar
            </Button>
          </form>
        ) : (
          <form
            onSubmit={step2Form.handleSubmit(handleStep2Submit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome completo
              </label>
              <Input {...step2Form.register("name")} placeholder="Seu nome" />
              {step2Form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {step2Form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Input
                {...step2Form.register("phone")}
                placeholder="(00) 00000-0000"
                onChange={handlePhoneChange}
                maxLength={15}
              />
              {step2Form.formState.errors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {step2Form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mensagem</label>
              <Textarea
                {...step2Form.register("message")}
                placeholder="Escreva uma mensagem"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                disabled={loading || !step2Form.formState.isValid}
              >
                {loading ? "Enviando..." : "Confirmar agendamento"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
