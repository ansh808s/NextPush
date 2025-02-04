import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";
import { ChevronDown, Loader } from "lucide-react";
import { Button } from "./ui/button";
import {
  DeploymentResponse,
  deploymentResponseStatus,
  DeploymentStatusFromApi,
  GetDeploymentLogsResponse,
} from "@/types/app/types";
import { useLazyGetDeploymentLogsQuery } from "@/redux/api/appApiSlice";
import LogItem from "./LogItem";

interface IDeploymentItem {
  deployment: DeploymentResponse;
}

export default function DeploymentItem(props: IDeploymentItem) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dataCache, setDataCache] = useState<GetDeploymentLogsResponse>();
  const [getLogData, { data: logData, isFetching: isLoadingLogs }] =
    useLazyGetDeploymentLogsQuery();
  const status = props.deployment["status"] as DeploymentStatusFromApi;
  const handleOpen = () => {
    if (!isOpen) {
      console.log("open");
      if (dataCache?.logs) {
        console.log("cache");
        return;
      } else {
        console.log("else");
        getLogData(props.deployment.id);
      }
    }
  };
  useEffect(() => {
    if (dataCache?.logs) {
      return;
    }
    if (logData?.logs) {
      setDataCache(logData);
    } else {
      return;
    }
  }, [logData]);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className=" border-gray-200 dark:border-gray-700 py-2"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">
            {new Date(props.deployment.createdAt).getDate().toString()}{" "}
            {new Date(props.deployment.createdAt)
              .toLocaleString("default", { month: "long" })
              .toString()}
          </p>
        </div>
        <div className="flex items-center gap-x-8">
          <p className={`${deploymentResponseStatus[status].color}`}>
            {deploymentResponseStatus[status].label}
          </p>
          <CollapsibleTrigger asChild>
            <Button onClick={handleOpen} variant="ghost" size="sm">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="mt-2">
        {isLoadingLogs ? (
          <>
            <div className="flex p-8 justify-center items-center">
              <Loader className="w-4 h-4 animate-spin text-rose-500" />
            </div>
          </>
        ) : (
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {dataCache?.logs.map((log, index) => (
              <LogItem key={index} {...log} />
            ))}
          </ScrollArea>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
