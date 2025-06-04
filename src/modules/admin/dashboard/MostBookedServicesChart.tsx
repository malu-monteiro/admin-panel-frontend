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

import { LabelList, Pie, PieChart } from "recharts";

import { useDashboardData } from "./hooks/useDashboardData";

export function MostBookedServicesChart() {
  const { servicesData, loading, error } = useDashboardData();

  const chartAndConfig = useMemo(() => {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(var(--chart-6))",
      "hsl(var(--chart-7))",
      "hsl(var(--chart-8))",
    ];

    const newChartData = servicesData.map((item, index) => ({
      name: item.name,
      value: item.value,
      fill: colors[index % colors.length],
    }));

    const newChartConfig: ChartConfig = {
      value: {
        label: "Appointments",
      },
      ...newChartData.reduce((acc, item) => {
        acc[item.name] = { label: item.name, color: item.fill };
        return acc;
      }, {} as ChartConfig),
    };

    return { newChartData, newChartConfig };
  }, [servicesData]);

  const { newChartData, newChartConfig } = chartAndConfig;

  const minCardHeight = "min-h-[350px]";

  if (loading) {
    return (
      <Card
        className={`flex flex-col items-center justify-center ${minCardHeight} w-full`}
      >
        <p>Loading most booked services data...</p>
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
          <CardTitle>No Services Booked</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            There is no service appointment data to display.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-full max-w-[450px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Most Booked Services</CardTitle>
        <CardDescription>Data for the most popular services</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center py-4">
        <ChartContainer
          config={newChartConfig}
          className="mx-auto aspect-square w-full max-w-[280px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie
              data={newChartData}
              dataKey="value"
              nameKey="name"
              innerRadius={80}
              outerRadius={100}
            >
              <LabelList
                dataKey="name"
                className="fill-foreground"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof newChartConfig) =>
                  newChartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Shows the most popular services.
        </div>
      </CardFooter>
    </Card>
  );
}
