import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { UserSiteAnalyticsEvent } from "./types/analytics/types";
import { sendUserSiteAnalyticsEvent } from "./config/kafka/producer";
import { v4 as uuidv4 } from "uuid";
import { shouldTrackPath } from "./utils/pathFilter";

const app = express();
const PORT = 8000;
const S3_URI = process.env.S3_URI;

async function logAnalytics(req: express.Request) {
  if (!shouldTrackPath(req.path)) {
    return;
  }
  const event: UserSiteAnalyticsEvent = {
    eventId: uuidv4(),
    siteSlug: req.hostname.split(".")[0],
    eventType: "pageview",
    hostname: req.hostname,
    path: req.path,
  };

  await sendUserSiteAnalyticsEvent(event);
}

app.use((req, res) => {
  logAnalytics(req).catch(console.error);
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];
  const resolvesTo = `${S3_URI}/${subdomain}`;

  return createProxyMiddleware({
    target: resolvesTo,
    changeOrigin: true,
    pathRewrite: (path) => (path === "/" ? "/index.html" : path),
  })(req, res);
});

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));
