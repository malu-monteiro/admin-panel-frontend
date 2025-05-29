import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const TIMEZONE = "America/Sao_Paulo";

export const toLocalDate = (date: string | Date) => dayjs(date).tz(TIMEZONE);

export const currentMonthRange = () => ({
  start: dayjs().tz(TIMEZONE).startOf("month").format("YYYY-MM-DD"),
  end: dayjs().tz(TIMEZONE).endOf("month").format("YYYY-MM-DD"),
});
