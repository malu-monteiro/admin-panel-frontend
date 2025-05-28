import { useState } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Step1Form } from "./components/Step1Form";
import { Step2Form } from "./components/Step2Form";

import { TIMEZONE, useSchedulingData } from "./hooks/useSchedulingData";

dayjs.extend(timezone);

export function SchedulingButton() {
  const [open, setOpen] = useState(false);

  const {
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
  } = useSchedulingData(open);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="appointment">Schedule a Service</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Book a service" : "Additional information"}
          </DialogTitle>

          <DialogDescription>
            {step === 1
              ? "Select your service and preferred time"
              : "Fill in your details to complete the booking"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <Step1Form
            step1Form={step1Form}
            services={services}
            availableTimes={availableTimes}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            timeBlocks={timeBlocks}
            handleStep1Submit={handleStep1Submit}
            TIMEZONE={TIMEZONE}
          />
        ) : (
          <Step2Form
            step2Form={step2Form}
            handleStep2Submit={handleStep2Submit}
            handlePhoneChange={handlePhoneChange}
            setStep={setStep}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
