import { UseFormReturn } from "react-hook-form";
import { useState, useEffect, useCallback, useMemo } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

import { toast } from "sonner";

import { Block, WorkingHours } from "@/types";

import API, { isAxiosError } from "@/lib/api/client";

import { getHoursArray } from "@/utils/manage-dates";

import { BlockFormValues, TIMEZONE } from "@/schemas/manageDatesSchema";

dayjs.extend(timezone);

export function useManageDates(form: UseFormReturn<BlockFormValues>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  const selectedDate = form.watch("date");

  const fetchBlocks = useCallback(async () => {
    try {
      const startDate = dayjs()
        .tz(TIMEZONE)
        .startOf("month")
        .format("YYYY-MM-DD");
      const endDate = dayjs().tz(TIMEZONE).endOf("month").format("YYYY-MM-DD");

      const response = await API.get<Block[]>("/availability/blocks", {
        params: { startDate, endDate },
      });

      setBlocks([...response.data]);
    } catch (error) {
      let message = "Failed to load blocks";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
      console.error("Error fetching blocks:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const whResponse = await API.get<WorkingHours>(
          "/availability/working-hours"
        );
        setWorkingHours(whResponse.data);

        await fetchBlocks();
      } catch (error) {
        let message = "Failed to load data";
        if (isAxiosError(error)) {
          message = error.response?.data?.error || message;
        }
        toast.error(message);
        console.error(error);
      }
    };
    loadData();
  }, [fetchBlocks]);

  const hours = useMemo(() => getHoursArray(workingHours), [workingHours]);

  const handleBlock = async (data: BlockFormValues) => {
    setIsSubmitting(true);
    try {
      const dateObj = dayjs.tz(data.date, TIMEZONE).startOf("day");
      if (dateObj.isBefore(dayjs().tz(TIMEZONE), "day")) {
        toast.error("Cannot block past dates");
        return;
      }

      const blockResponse = await API.post("/availability/blocks", {
        date: dateObj.format("YYYY-MM-DD"),
        startTime: data.startTime,
        endTime: data.endTime,
      });

      if (blockResponse.status === 201) {
        setBlocks((prev) => [...prev, blockResponse.data]);
        toast.success("Time slot blocked!");
        setTimeout(() => {
          fetchBlocks();
          form.reset();
        }, 300);
      }
    } catch (error) {
      let message = "An unexpected error occurred";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlockDay = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    const dateObj = dayjs.tz(selectedDate, TIMEZONE).startOf("day");
    if (dateObj.isBefore(dayjs().tz(TIMEZONE), "day")) {
      toast.error("Cannot block past dates");
      return;
    }

    setIsSubmitting(true);
    try {
      const dateStr = dateObj.format("YYYY-MM-DD");
      const res = await API.get<Block[]>("/availability/blocks", {
        params: { startDate: dateStr, endDate: dateStr },
      });

      const existingBlock = res.data[0];
      if (existingBlock?.isBlocked) {
        toast.error("This day is already blocked.");
        setIsSubmitting(false);
        return;
      }

      if (existingBlock?.blockedSlots?.length) {
        await Promise.all(
          existingBlock.blockedSlots.map((slot) =>
            API.delete(`/availability/blocks/slot/${slot.id}`)
          )
        );
      }

      const blockResponse = await API.post("/availability/blocks", {
        date: dateStr,
      });

      if (blockResponse.status === 201) {
        toast.success("Day blocked successfully");
        setTimeout(() => {
          fetchBlocks();
          form.reset();
        }, 300);
      }
    } catch (error) {
      let message = "Failed to block day";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    workingHours,
    blocks,
    hours,
    handleBlock,
    handleBlockDay,
    selectedDate,
  };
}
