import React from "react";
import { DailyVisitsChart } from "./DailyVisitsChart";
import {
  useGetRouteVisitsQuery,
  useGetSiteVisitsQuery,
} from "@/redux/api/appApiSlice";
import { DaySiteVisits, GetSiteVisitsDayResponse } from "@/types/app/types";
import WeeklyVisitsChart from "./WeeklyVisitsChart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface IDashBoardAnalytics {
  projectId: string;
}

export default function DashBoardAnalytics(props: IDashBoardAnalytics) {
  const { data: routeVisits, isFetching: isRouteVisitsLoading } =
    useGetRouteVisitsQuery({ id: props.projectId, type: "day" });
  const { data: totalVists, isFetching: isTotalVisitsFetching } =
    useGetSiteVisitsQuery({
      id: props.projectId,
      type: "today",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  const { data: weeklyVisitsData, isFetching: isLoadingVisits } =
    useGetSiteVisitsQuery({
      id: props.projectId,
      type: "week",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <DailyVisitsChart
          totalVisits={totalVists as GetSiteVisitsDayResponse}
          isLoading={isRouteVisitsLoading || isTotalVisitsFetching}
          routeVists={routeVisits!}
        />
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Weekly Trafic of the Site</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <WeeklyVisitsChart
              labels={true}
              loading={isLoadingVisits}
              weeklyVisitData={weeklyVisitsData?.visits as DaySiteVisits[]}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-6"></div>
    </div>
  );
}
