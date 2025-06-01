import { useForm } from "react-hook-form";
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
import { isDateDisabled } from "@/utils/isDateDisabled";

import dayjs from "dayjs";

import { useManageDates } from "./hooks/useManageDates";

import { BlockFormValues, blockSchema, TIMEZONE } from "./schemas/blockSchema";

export function ManageDates() {
  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
    defaultValues: { date: "", startTime: "", endTime: "" },
  });

  const {
    isSubmitting,

    blocks,
    hours,
    handleBlock,
    handleBlockDay,
    selectedDate,
  } = useManageDates(form);

  return (
    <div>
      <Card className="p-4 mb-6 max-w-md">
        <form onSubmit={form.handleSubmit(handleBlock)} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Calendar
              mode="single"
              selected={
                selectedDate
                  ? dayjs.tz(selectedDate, TIMEZONE).toDate()
                  : undefined
              }
              onSelect={(date) => {
                form.setValue(
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
            {form.formState.errors.date && (
              <p className="text-red-500 text-sm mt-2">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Select
                value={form.watch("startTime")}
                onValueChange={(value) => form.setValue("startTime", value)}
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
              {form.formState.errors.startTime && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.startTime.message}
                </p>
              )}
            </div>

            <div>
              <Label>End Time</Label>
              <Select
                value={form.watch("endTime")}
                onValueChange={(value) => form.setValue("endTime", value)}
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
              {form.formState.errors.endTime && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.endTime.message}
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
