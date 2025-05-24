import axios from "axios";
import { AppointmentData } from "@/types";

export async function createAppointment(appointmentData: AppointmentData) {
  return axios.post("/availability/appointments", appointmentData);
}
