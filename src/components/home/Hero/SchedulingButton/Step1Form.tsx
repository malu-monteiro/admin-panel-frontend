import { Step1Data } from "@/components/home/Hero/SchedulingButton/schemas/schedulingSchemas";
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
import { isDateDisabled } from "@/utils/is-date-disbled";

interface Step1FormProps {
  form: UseFormReturn<Step1Data>;
  services: string[];
  blockedDates: Date[];
  availableTimes: string[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  onSubmit: () => void;
}

export function Step1Form({
  form,
  services,
  blockedDates,
  availableTimes,
  selectedDate,
  setSelectedDate,
  onSubmit,
}: Step1FormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Select a service
        </label>
        <Select
          onValueChange={(value) => {
            form.setValue("service", value);
            form.trigger("service");
          }}
          value={form.watch("service")}
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
        {form.formState.errors.service && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.service.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Choose a date</label>
        <Calendar
          mode="single"
          selected={form.watch("date")}
          onSelect={(date) => {
            if (date) {
              const localDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              );
              form.setValue("date", localDate);
              form.trigger("date");
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
        {form.formState.errors.date && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.date.message}
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
              form.setValue("time", value);
              form.trigger("time");
            }}
            value={form.watch("time")}
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
          {form.formState.errors.time && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.time.message}
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full hover:bg-accent hover:text-muted-foreground "
        disabled={!form.formState.isValid}
      >
        Continue
      </Button>
    </form>
  );
}
