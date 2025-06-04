import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useDashboardData } from "./hooks/useDashboardData";

export function MostBookedTimesChart() {
  const { timesData, loading, error } = useDashboardData();

  const chartAndConfig = useMemo(() => {
    const newChartData = timesData
      .map((item) => ({
        time: item.time,
        appointments: item.appointments,
      }))
      .sort((a, b) => {
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);
        if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
        return timeA[1] - timeB[1];
      });

    const newChartConfig = {
      appointments: {
        label: "Appointments",
        color: "hsl(var(--chart-1))",
      },
      time: {
        label: "Time of Day",
      },
    } satisfies ChartConfig;

    return { newChartData, newChartConfig };
  }, [timesData]);

  const { newChartData, newChartConfig } = chartAndConfig;

  const minCardHeight = "min-h-[350px]";

  if (loading) {
    return (
      <Card
        className={`flex flex-col items-center justify-center ${minCardHeight} w-full`}
      >
        <p>Loading most booked times data...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={`flex flex-col items-center justify-center ${minCardHeight} w-full`}
      >
        <CardHeader>
          <CardTitle>Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!newChartData || newChartData.length === 0) {
    return (
      <Card
        className={`flex flex-col items-center justify-center ${minCardHeight} w-full`}
      >
        <CardHeader>
          <CardTitle>No Appointments Booked</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            There is no appointment data for times to display.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-full max-w-[450px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Most Booked Times</CardTitle>
        <CardDescription>Appointments by time of day</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center py-4">
        <ChartContainer config={newChartConfig} className="w-full h-[200px]">
          <BarChart accessibilityLayer data={newChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              dataKey="appointments"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => String(value)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="appointments"
              fill="var(--color-appointments)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Shows the most popular appointment times.
        </div>
      </CardFooter>
    </Card>
  );
}
