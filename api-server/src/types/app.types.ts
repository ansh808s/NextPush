export interface LogEvent {
  type: "info" | "error" | "warning" | "success";
  message: string;
  timestamp: string;
  deployment_id: string;
}
