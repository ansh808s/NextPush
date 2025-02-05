import { LogEntry } from "@/types/app/types";
import { CheckCircle, CircleAlert, Info, XCircle } from "lucide-react";

export default function LogItem(
  props: Pick<LogEntry, "type" | "timestamp" | "message">
) {
  const getIcon = () => {
    switch (props.type) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      case "warning":
        return <CircleAlert className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTextColor = () => {
    switch (props.type) {
      case "error":
        return "text-red-500";
      case "success":
        return "text-green-500";
      case "info":
        return "text-blue-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };
  //TODO: Imrpove date display
  return (
    <div className="flex items-start space-x-2 py-1">
      <div className="flex-shrink-0 pt-1">{getIcon()}</div>
      <div className="flex-grow">
        <span className="text-sm font-medium text-gray-400">
          {new Date(props.timestamp).toString()}
        </span>
        <p className={`text-sm ${getTextColor()}`}>{props.message}</p>
      </div>
    </div>
  );
}
