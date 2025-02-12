import React from "react";
import { DailyVisitsChart } from "./DailyVisitsChart";
import {
  useGetRouteVisitsQuery,
  useGetSiteVisitsQuery,
} from "@/redux/api/appApiSlice";
import { GetSiteVisitsDayResponse } from "@/types/app/types";

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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <DailyVisitsChart
          totalVisits={totalVists as GetSiteVisitsDayResponse}
          isLoading={isRouteVisitsLoading || isTotalVisitsFetching}
          routeVists={routeVisits!}
        />
      </div>
    </div>
  );
}
