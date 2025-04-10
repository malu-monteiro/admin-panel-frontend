import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import axios from "axios";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

import { Availability, AppointmentData } from "@/types";

import isBetween from "dayjs/plugin/isBetween";

import { isDateDisabled } from "@/utils/isDateDisabled";

dayjs.extend(utc);
dayjs.extend(isBetween);

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

const services = [
  "Corte de Cabelo",
  "Barba",
  "Corte + Barba",
  "Coloração",
] as const;

const API_URL = "http://localhost:3000";

export function SchedulingButton() {
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
    const fetchBlockedDates = async () => {
      try {
        const response = await axios.get<Availability[]>(
          `${API_URL}/api/blocks`,
          {
            params: {
              startDate: dayjs().format("YYYY-MM-DD"),
              endDate: dayjs().add(3, "month").format("YYYY-MM-DD"),
            },
          }
        );

        const fullyBlockedDates = response.data
          .filter((block) => block.isBlocked === true)
          .map((block) => new Date(block.date));

        const timeBlocksData = response.data
          .filter((block) => !block.isBlocked && block.blockedSlots)
          .flatMap(
            (block) =>
              block.blockedSlots?.map((slot) => ({
                date: dayjs(slot.startTime).format("YYYY-MM-DD"),

                startTime: dayjs(slot.startTime).format("HH:mm"),
                endTime: dayjs(slot.endTime).format("HH:mm"),
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
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const generateAvailableTimes = () => {
      const times: string[] = [];
      const startHour = 8;
      const endHour = 18;
      const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");

      const dayTimeBlocks = timeBlocks.filter(
        (block) => block.date === dateStr
      );

      for (let hour = startHour; hour <= endHour; hour++) {
        const timeString = `${hour.toString().padStart(2, "0")}:00`;

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
  }, [selectedDate, timeBlocks]);

  // Formulários
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
        date: dayjs(step1Data.date).format("YYYY-MM-DD"),
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
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          variant="slate"
        >
          Agendar
        </Button>
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
                    step1Form.setValue("date", date);
                    step1Form.trigger("date");
                    setSelectedDate(date);
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
