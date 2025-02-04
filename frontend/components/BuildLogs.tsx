import type React from "react";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { LogEntry } from "@/types/app/types";
import LogItem from "./LogItem";
import { cn } from "@/lib/utils";

interface IBuildLogs {
  isDeployed: boolean;
  logs: Pick<LogEntry, "type" | "timestamp" | "message">[];
  isLoadingLogs: boolean;
  isDashboardDisplay?: boolean;
}

export default function BuildLogs(props: IBuildLogs) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [scrollAreaRef]);
  return (
    <Card className="border-rose-200 dark:border-rose-800">
      {props.isDashboardDisplay ? (
        <></>
      ) : (
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {props.isDeployed ? "Build Logs" : "Deployment Console"}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {props.isDeployed ? (
          <ScrollArea
            className={cn(
              `h-[600px] w-full rounded-md ${
                props.isDashboardDisplay ? "py-2" : "border p-4"
              }`
            )}
            ref={scrollAreaRef}
          >
            {props.logs.map((log, index) => (
              <LogItem key={index} {...log} />
            ))}
          </ScrollArea>
        ) : (
          <div className="h-[600px] w-full rounded-md border p-4 flex flex-col items-center justify-center space-y-4">
            <Rocket className="w-16 h-16 text-rose-500 " />
            <p className="text-center text-light">
              Once deployment is started you will see its progress here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
