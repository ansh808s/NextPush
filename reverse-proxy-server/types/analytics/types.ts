export type UserSiteAnalyticsEvent = {
  eventId: string;
  siteSlug: string;
  eventType: "pageview";
  hostname: string;
  path: string;
};
