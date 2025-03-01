import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { UserSiteAnalyticsEvent } from "./types/analytics/types";
import { sendUserSiteAnalyticsEvent } from "./config/kafka/producer";
import { v4 as uuidv4 } from "uuid";
import { shouldTrackPath } from "./utils/pathFilter";
import fs from "fs";
import path from "path";
import { getCurrentDeploymentId } from "./db";

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

const custom404File = path.join(__dirname, "404.html");
const custom404 = fs.readFileSync(custom404File, "utf-8");

app.use(async (req, res) => {
  logAnalytics(req).catch(console.error);
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  const deployment = await getCurrentDeploymentId(subdomain);
  if (!deployment) {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 404;
    res.end(custom404);
    return;
  }

  const resolvesTo = `${S3_URI}/${subdomain}/${deployment}`;
  console.log(resolvesTo);

  return createProxyMiddleware({
    target: resolvesTo,
    changeOrigin: true,
    pathRewrite: (path) => (path === "/" ? "/index.html" : path),
    on: {
      proxyRes: (proxyRes, req, res) => {
        if (proxyRes.statusCode == 403 || proxyRes.statusCode == 404) {
          res.setHeader("Content-Type", "text/html");
          res.statusCode = 404;
          res.end(custom404);
        }
      },
    },
  })(req, res);
});

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));
