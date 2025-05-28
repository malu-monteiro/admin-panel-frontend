import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { toast } from "sonner";

import { Block, WorkingHours } from "@/types";
import { isDateDisabled } from "@/utils/is-date-disbled";

import API, { isAxiosError } from "@/lib/api/client";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "America/Sao_Paulo";

const blockSchema = z
  .object({
    date: z.string().min(1, "Please select a date"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      const start = dayjs.tz(`${data.date}T${data.startTime}`, TIMEZONE);
      const end = dayjs.tz(`${data.date}T${data.endTime}`, TIMEZONE);
      return end.isAfter(start);
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

type BlockFormValues = z.infer<typeof blockSchema>;

export function ManageDates() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  const { handleSubmit, setValue, reset, watch, formState } =
    useForm<BlockFormValues>({
      resolver: zodResolver(blockSchema),
      defaultValues: {
        date: "",
        startTime: "",
        endTime: "",
      },
    });

  const selectedDate = watch("date");

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

      setBlocks([...response.data]);
    } catch (error) {
      console.error("Error fetching blocks:", error);
      let message = "Failed to load blocks";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
    }
  };

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
      }
    };
    loadData();
  }, []);

  const hours = useMemo(() => {
    if (!workingHours) return [];
    const [start] = workingHours.startTime.split(":").map(Number);
    const [end] = workingHours.endTime.split(":").map(Number);
    return Array.from(
      { length: end - start + 1 },
      (_, i) => `${String(start + i).padStart(2, "0")}:00`
    );
  }, [workingHours]);

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
          reset();
        }, 300);
      }
    } catch (error) {
      let message = "An unexpected error occurred";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
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
        params: {
          startDate: dateStr,
          endDate: dateStr,
        },
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
          reset();
        }, 300);
      }
    } catch (error) {
      let message = "Failed to block day";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card className="p-4 mb-6 max-w-md">
        <form onSubmit={handleSubmit(handleBlock)} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Calendar
              mode="single"
              selected={
                selectedDate
                  ? dayjs.tz(selectedDate, TIMEZONE).toDate()
                  : undefined
              }
              onSelect={(date) => {
                setValue(
                  "date",
                  date ? dayjs(date).tz(TIMEZONE).format("YYYY-MM-DD") : ""
                );
              }}
              disabled={(date) =>
                isDateDisabled(date, {
                  blocks,
                  allowAfterHours: false,
                  timezone: TIMEZONE,
                })
              }
              className="flex-1"
            />
            {formState.errors.date && (
              <p className="text-red-500 text-sm mt-2">
                {formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Select
                value={watch("startTime")}
                onValueChange={(value) => setValue("startTime", value)}
              >
                <SelectTrigger className="!bg-neutral-100">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formState.errors.startTime && (
                <p className="text-red-500 text-sm">
                  {formState.errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <Label>End Time</Label>
              <Select
                value={watch("endTime")}
                onValueChange={(value) => setValue("endTime", value)}
              >
                <SelectTrigger className="!bg-neutral-100">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formState.errors.endTime && (
                <p className="text-red-500 text-sm">
                  {formState.errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Blocking..." : "Block Time"}
            </Button>

            <Button
              type="button"
              onClick={handleBlockDay}
              disabled={!selectedDate || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Processing..." : "Block Entire Day"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
