import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";

import axios from "axios";
import dayjs from "dayjs";

import API from "@/lib/api/client";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Step1Data,
  step1Schema,
  Step2Data,
  step2Schema,
} from "../schemas/schedulingSchemas";

import { toast } from "sonner";

import { formatPhoneNumber } from "../utils/formatPhone";
import { isSlotBlocked } from "@/modules/scheduling/utils/isSlotBlocked";

import type { Block, Availability, AppointmentData } from "@/types";

export const TIMEZONE = "America/Sao_Paulo";

export function useSchedulingData(open: boolean) {
  const [workingHours, setWorkingHours] = useState<{
    startTime: "08:00";
    endTime: "18:00";
    isDefault?: boolean;
  } | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeBlocks, setTimeBlocks] = useState<Block[]>([]);

  useEffect(() => {
    if (!open) return;

    const fetchInitialData = async () => {
      try {
        const [workingHoursRes, servicesRes, blocksRes] = await Promise.all([
          API.get("/availability/working-hours"),
          API.get("/availability/services"),
          API.get<Availability[]>("/availability/blocks", {
            params: {
              startDate: dayjs()
                .tz(TIMEZONE)
                .startOf("month")
                .format("YYYY-MM-DD"),
              endDate: dayjs()
                .tz(TIMEZONE)
                .endOf("month")
                .add(3, "month")
                .format("YYYY-MM-DD"),
            },
          }),
        ]);

        setWorkingHours({ ...workingHoursRes.data, isDefault: false });
        setServices(servicesRes.data.map((s: { name: string }) => s.name));
        setTimeBlocks(blocksRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setWorkingHours({
          startTime: "08:00",
          endTime: "18:00",
          isDefault: true,
        });
        setServices([
          "Healthcare",
          "Daycare",
          "Training",
          "Pet Grooming",
          "Hygienic Care",
        ]);
      }
    };

    fetchInitialData();
  }, [open]);

  const availableTimes = useMemo(() => {
    if (!selectedDate || !workingHours) return [];

    const [startHour] = workingHours.startTime.split(":").map(Number);
    const [endHour, endMinute] = workingHours.endTime.split(":").map(Number);
    const times: string[] = [];
    const totalSlots = endHour - startHour + (endMinute > 0 ? 1 : 0);

    for (let i = 0; i < totalSlots; i++) {
      const currentHour = startHour + i;
      const timeString = `${currentHour.toString().padStart(2, "0")}:00`;

      const isBlocked = isSlotBlocked(
        selectedDate,
        timeString,
        timeBlocks,
        TIMEZONE
      );

      if (!isBlocked) {
        times.push(timeString);
      }
    }

    return times;
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
        date: dayjs(step1Data.date).tz(TIMEZONE).format("YYYY-MM-DD"),
        time: step1Data.time,
        name: data.name,
        phone: data.phone,
        message: data.message,
      };

      await axios.post("/availability/appointments", appointmentData);

      toast.success("Appointment successfully scheduled!");

      setStep(1);
      step1Form.reset();
      step2Form.reset();
    } catch (error) {
      let errorMessage = "An error occurred while scheduling the appointment.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    step2Form.setValue("phone", formattedValue);
  };

  return {
    workingHours,
    services,
    step,
    setStep,
    loading,
    selectedDate,
    setSelectedDate,
    timeBlocks,
    availableTimes,
    step1Form,
    step2Form,
    handleStep1Submit,
    handleStep2Submit,
    handlePhoneChange,
  };
}
