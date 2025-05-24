import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import API from "@/lib/api/client";

import { Availability } from "@/types";

dayjs.extend(utc);
dayjs.extend(isBetween);

export const useSchedulingData = () => {
  const [workingHours, setWorkingHours] = useState<{
    startTime: "08:00";
    endTime: "18:00";
    isDefault?: boolean;
  } | null>(null);

  const [services, setServices] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<
    Array<{ date: string; startTime: string; endTime: string }>
  >([]);

  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const response = await API.get("/availability/working-hours");
        setWorkingHours({ ...response.data, isDefault: false });
      } catch (error) {
        console.error("Error fetching working hours:", error);
        setWorkingHours({
          startTime: "08:00",
          endTime: "18:00",
          isDefault: true,
        });
      }
    };
    fetchWorkingHours();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await API.get("/availability/services");
        setServices(response.data.map((s: { name: string }) => s.name));
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([
          "Healthcare",
          "Daycare",
          "Training",
          "Pet Grooming",
          "Hygienic Care",
        ]);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await API.get<Availability[]>("/availability/blocks", {
          params: {
            startDate: dayjs().utc().format("YYYY-MM-DD"),
            endDate: dayjs().utc().add(3, "month").format("YYYY-MM-DD"),
          },
        });

        const fullyBlockedDates = response.data
          .filter((block) => block.isBlocked)
          .map((block) => dayjs.utc(block.date).local().toDate());

        const timeBlocksData = response.data
          .filter((block) => !block.isBlocked && block.blockedSlots)
          .flatMap(
            (block) =>
              block.blockedSlots?.map((slot) => ({
                date: dayjs.utc(slot.startTime).local().format("YYYY-MM-DD"),
                startTime: dayjs.utc(slot.startTime).local().format("HH:mm"),
                endTime: dayjs.utc(slot.endTime).local().format("HH:mm"),
              })) || []
          );

        setBlockedDates(fullyBlockedDates);
        setTimeBlocks(timeBlocksData);
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      }
    };
    fetchBlockedDates();
  }, []);

  return { workingHours, services, blockedDates, timeBlocks };
};
