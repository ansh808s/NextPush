import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = 8000;
const S3_URI = process.env.S3_URI;

app.use((req, res) => {
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
