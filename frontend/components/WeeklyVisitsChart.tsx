"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DaySiteVisits } from "@/types/app/types";
import { Skeleton } from "./ui/skeleton";

const chartConfig = {
  count: {
    label: "Visits",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface IWeeklyVisitsChart {
  weeklyVisitData?: DaySiteVisits[];
  loading: boolean;
}

export default function WeeklyVisitsChart(props: IWeeklyVisitsChart) {
  return (
    <>
      {props.loading ? (
        <Skeleton className="w-full h-[300px]" />
      ) : (
        <ChartContainer className="mt-11" config={chartConfig}>
          <BarChart accessibilityLayer data={props.weeklyVisitData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8} />
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
}
