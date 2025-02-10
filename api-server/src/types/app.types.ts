export interface LogEvent {
  type: "info" | "error" | "warning" | "success";
  message: string;
  timestamp: string;
  deployment_id: string;
}

export type UserSiteAnalyticsEvent = {
  eventId: string;
  siteSlug: string;
  eventType: "pageview";
  hostname: string;
  path: string;
};

export type DayVisits = {
  date: Date;
  count: number;
};
