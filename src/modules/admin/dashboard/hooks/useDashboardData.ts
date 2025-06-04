import { useEffect, useState } from "react";

import { toast } from "sonner";

import API, { isAxiosError } from "@/lib/api/client";

import { DashboardData, ServiceData, TimeData } from "@/types";

export function useDashboardData(): DashboardData {
  const [servicesData, setServicesData] = useState<ServiceData[]>([]);
  const [timesData, setTimesData] = useState<TimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [servicesResponse, timesResponse] = await Promise.all([
          API.get<ServiceData[]>("/analytics/most-booked-services"),
          API.get<TimeData[]>("/analytics/most-booked-times"),
        ]);

        setServicesData(servicesResponse.data ?? []);
        setTimesData(timesResponse.data ?? []);
      } catch (err: unknown) {
        console.error("Error fetching chart data:", err);
        let message = "Failed to load chart data. Please try again later.";

        if (isAxiosError(err)) {
          message =
            err.response?.data?.message || err.response?.data?.error || message;
        }
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return { servicesData, timesData, loading, error };
}
