import { useEffect, useState } from "react";
import { generateAvailableTimes } from "../utils/availabilityHelpers";

export const useAvailableTimes = (
  selectedDate: Date | undefined,
  workingHours: { startTime: string; endTime: string } | null,
  timeBlocks: Array<{ date: string; startTime: string; endTime: string }>
) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate || !workingHours) {
      setAvailableTimes([]);
      return;
    }

    setAvailableTimes(
      generateAvailableTimes(selectedDate, workingHours, timeBlocks)
    );
  }, [selectedDate, timeBlocks, workingHours]);

  return availableTimes;
};
