import type { RequestHandler } from "express";
import { client } from "../../config/clickhouse/client";

export const getDeploymentLogs: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const logs = await client.query({
    query: `  SELECT 
        event_id,
        deployment_id,
        type,
        message,
        timestamp
      FROM log_events 
      WHERE deployment_id = {deployment_id:String}
      `,
    query_params: {
      deployment_id: id,
    },
    format: "JSONEachRow",
  });
  const rawLogs = await logs.json();
  res.status(200).json({ logs: rawLogs });
  return;
};
