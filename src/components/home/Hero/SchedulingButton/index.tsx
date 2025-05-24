import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  step1Schema,
  step2Schema,
  Step1Data,
  Step2Data,
} from "@/components/home/Hero/SchedulingButton/schemas/schedulingSchemas";

import { useSchedulingData } from "./hooks/useSchedulingData";
import { useSchedulingSubmission } from "./hooks/useSchedulingSubmission";

import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";

import { useAvailableTimes } from "./hooks/useAvailableTimes";
import { handlePhoneChange } from "./utils/phoneMask";
import { buildAppointmentData } from "./utils/buildAppointmentData";

export function SchedulingButton() {
  const [step, setStep] = useState<1 | 2>(1);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { workingHours, services, blockedDates, timeBlocks } =
    useSchedulingData();

  const availableTimes = useAvailableTimes(
    selectedDate,
    workingHours,
    timeBlocks
  );

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    shouldUnregister: true,
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  });

  const { submit, loading } = useSchedulingSubmission(() => {
    setOpen(false);
    setStep(1);
    step1Form.reset();
    step2Form.reset();
  });

  const handleStep1Submit = () => {
    setStep(2);
  };

  const handleStep2Submit = async (data: Step2Data) => {
    await submit(buildAppointmentData(step1Form.getValues(), data));
  };

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
            form={step1Form}
            services={services}
            blockedDates={blockedDates}
            availableTimes={availableTimes}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onSubmit={handleStep1Submit}
          />
        ) : (
          <Step2Form
            form={step2Form}
            loading={loading}
            onBack={() => setStep(1)}
            onSubmit={step2Form.handleSubmit(handleStep2Submit)}
            onPhoneChange={(e) => handlePhoneChange(e, step2Form.setValue)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
