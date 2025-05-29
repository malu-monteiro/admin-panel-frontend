import dayjs from "dayjs";

import { UseFormReturn } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { isDateDisabled } from "@/utils/isDateDisabled";

import { Step1Data } from "../schemas/schedulingSchemas";

import type { Block } from "@/types";

type Step1FormProps = {
  step1Form: UseFormReturn<Step1Data>;
  services: string[];
  availableTimes: string[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date) => void;
  timeBlocks: Block[];
  handleStep1Submit: () => void;
  TIMEZONE: string;
};

export function Step1Form({
  step1Form,
  services,
  availableTimes,
  selectedDate,
  setSelectedDate,
  timeBlocks,
  handleStep1Submit,
  TIMEZONE,
}: Step1FormProps) {
  return (
    <form
      onSubmit={step1Form.handleSubmit(handleStep1Submit)}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">
          Select a service
        </label>
        <Select
          onValueChange={(value) => {
            step1Form.setValue("service", value);
            step1Form.trigger("service");
          }}
          value={step1Form.watch("service")}
        >
          <SelectTrigger className="!bg-neutral-100">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem
                className="hover:!bg-neutral-200"
                key={service}
                value={service}
              >
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
        <label className="block text-sm font-medium mb-1">Choose a date</label>
        <Calendar
          mode="single"
          selected={step1Form.watch("date")}
          onSelect={(date) => {
            if (date) {
              const localDate = dayjs(date)
                .tz(TIMEZONE)
                .startOf("day")
                .toDate();
              step1Form.setValue("date", localDate);
              setSelectedDate(localDate);
            }
          }}
          disabled={(date) =>
            isDateDisabled(date, {
              timezone: TIMEZONE,
              blocks: timeBlocks,
              blockWeekends: true,
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
            Select a time
          </label>
          <Select
            onValueChange={(value) => {
              step1Form.setValue("time", value);
              step1Form.trigger("time");
            }}
            value={step1Form.watch("time")}
          >
            <SelectTrigger className="!bg-neutral-100">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <SelectItem
                  key={time}
                  value={time}
                  className="hover:!bg-neutral-200"
                >
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
        Continue
      </Button>
    </form>
  );
}
