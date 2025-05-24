import { useState } from "react";
import { toast } from "sonner";
import { AppointmentData } from "@/types";
import { createAppointment } from "../services/schedulingService";

export function useSchedulingSubmission(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const submit = async (appointmentData: AppointmentData) => {
    try {
      setLoading(true);
      await createAppointment(appointmentData);
      toast.success("Appointment successfully scheduled!");
      onSuccess?.();
    } catch (error: any) {
      let errorMessage = "An error occurred while scheduling the appointment.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
}
