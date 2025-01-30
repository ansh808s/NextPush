import { createClient } from "@clickhouse/client";

export const clickhouseClient = createClient({
  host: process.env.CH_URL!,
  database: process.env.CH_DB!,
  username: process.env.CH_USER!,
  password: process.env.CH_PASS!,
});
