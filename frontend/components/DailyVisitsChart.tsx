"use client";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  GetRouteVisitsResponse,
  GetSiteVisitsDayResponse,
} from "@/types/app/types";
import { Skeleton } from "./ui/skeleton";

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
];

interface IDailyVisitsChart {
  routeVists?: GetRouteVisitsResponse;
  totalVisits: GetSiteVisitsDayResponse;
  isLoading: boolean;
}

export function DailyVisitsChart(props: IDailyVisitsChart) {
  const chartData = props.routeVists?.visits.slice(0, 5).map((item, index) => ({
    ...item,
    fill: chartColors[index % chartColors.length],
  }));

  const generateChartConfig = (): ChartConfig => {
    const config: ChartConfig = {
      visitors: {
        label: "Visitors",
      },
    };

    props.routeVists?.visits.slice(0, 5).forEach((route, index) => {
      const key = route.path.replace(/[^a-zA-Z0-9]/g, "_");

      config[key] = {
        label: route.path,
        color: chartColors[index % chartColors.length],
      };
    });

    return config;
  };

  const dynamicChartConfig = React.useMemo(
    () => generateChartConfig(),
    [props.routeVists]
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Today&apos;s Traffic with Top Routes</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {props.isLoading ? (
          <>
            <Skeleton className="h-[200px] my-10 w-full" />
          </>
        ) : props.routeVists && props.routeVists.visits.length > 0 ? (
          <ChartContainer
            config={dynamicChartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="_count"
                nameKey="path"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {props.totalVisits?.visits?.toLocaleString() || 0}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">No route data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
