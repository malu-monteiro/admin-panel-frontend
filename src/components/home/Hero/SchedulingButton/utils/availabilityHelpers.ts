import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

type TimeBlock = { date: string; startTime: string; endTime: string };
type WorkingHours = { startTime: string; endTime: string };

export const generateAvailableTimes = (
  selectedDate: Date,
  workingHours: WorkingHours | null,
  timeBlocks: TimeBlock[]
): string[] => {
  if (!selectedDate || !workingHours) return [];

  const [startHour] = workingHours.startTime.split(":").map(Number);
  const [endHour, endMinute] = workingHours.endTime.split(":").map(Number);

  const times: string[] = [];
  const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");
  const dayTimeBlocks = timeBlocks.filter((block) => block.date === dateStr);

  const totalSlots = endHour - startHour + (endMinute > 0 ? 1 : 0);

  for (let i = 0; i < totalSlots; i++) {
    const currentHour = startHour + i;
    const timeString = `${currentHour.toString().padStart(2, "0")}:00`;

    const isBlocked = dayTimeBlocks.some((block) => {
      const slotTime = dayjs(`2000-01-01 ${timeString}`);
      const blockStart = dayjs(`2000-01-01 ${block.startTime}`);
      const blockEnd = dayjs(`2000-01-01 ${block.endTime}`);

      return slotTime.isBetween(blockStart, blockEnd, null, "[]");
    });

    if (!isBlocked) times.push(timeString);
  }

  return times;
};
