import type { RequestHandler } from "express";
import { client } from "../../config/clickhouse/client";

export const getDeploymentLogs: RequestHandler = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({
      message: "Deployment id not provided",
    });
    return;
  }
  try {
    const logs = await client.query({
      query: `  SELECT 
          event_id,
          deployment_id,
          type,
          message,
          timestamp
        FROM log_events 
        WHERE deployment_id = {deployment_id:String}
        ORDER BY timestamp ASC
        `,
      query_params: {
        deployment_id: id,
      },
      format: "JSONEachRow",
    });
    const rawLogs = await logs.json();
    res.status(200).json({ logs: rawLogs });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
};
