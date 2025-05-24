import dayjs from "dayjs";
import { Step1Data, Step2Data } from "../schemas/schedulingSchemas";
import { AppointmentData } from "@/types";

export const buildAppointmentData = (
  step1Data: Step1Data,
  step2Data: Step2Data
): AppointmentData => ({
  service: step1Data.service,
  date: dayjs(step1Data.date).utc().format("YYYY-MM-DD"),
  time: step1Data.time,
  name: step2Data.name,
  phone: step2Data.phone,
  message: step2Data.message,
});
