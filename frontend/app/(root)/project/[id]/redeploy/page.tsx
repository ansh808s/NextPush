"use client";

import BuildLogs from "@/components/BuildLogs";
import { Button } from "@/components/ui/button";
import {
  useCreateDeploymentMutation,
  useGetDeploymentLogsQuery,
} from "@/redux/api/appApiSlice";
import { LogEntry } from "@/types/app/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

export default function Redeploy() {
  const [logs, setLogs] = useState<
    Pick<LogEntry, "type" | "timestamp" | "message">[]
  >([]);
  const params = useParams();
  const projectId = params.id;
  const router = useRouter();

  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [createDeployment] = useCreateDeploymentMutation();
  const { data: logData, isFetching: isLoadingLogs } =
    useGetDeploymentLogsQuery(deploymentId!, {
      skip: !deploymentId,
      pollingInterval: 4000,
    });

  const onDeploymentHandler = async () => {
    try {
      const deployment = await createDeployment({
        projectId: projectId! as string,
      }).unwrap();
      toast.info("Deployment Started", { id: "deploy" });
      setDeploymentId(deployment.deploymentId);
    } catch (error) {
      console.log(error);
    }
  };
  const isDeploymentComplete = (
    logs: Pick<LogEntry, "type" | "timestamp" | "message">[]
  ) => {
    if (logs.length === 0) return false;
    const hasError = logs.some((log) => log.type === "error");
    if (hasError) {
      return "error";
    }
    const hasSuccess = logs.some((log) => log.type === "success");
    if (hasSuccess) {
      return "success";
    }
    return null;
  };

  useEffect(() => {
    if (logs.length === 0) {
      return;
    }
    const deploymentStatus = isDeploymentComplete(logs);

    if (deploymentStatus === "success") {
      toast.success("Deployment successful");
      router.push(`/project/${projectId}`);
    } else if (deploymentStatus === "error") {
      toast.error("Deployment failed");
      router.push(`/project/${projectId}`);
    }
  }, [logs, projectId, router]);

  useEffect(() => {
    if (!logData) {
      return;
    } else if (logData.logs.length > 0) {
      setLogs((prevLogs) => {
        if (prevLogs.length === 0) {
          return logData.logs;
        }
        const lastExistingLog = prevLogs[prevLogs.length - 1];
        const newLogsStartIndex = logData.logs.findIndex(
          (log) => new Date(log.timestamp) > new Date(lastExistingLog.timestamp)
        );
        if (newLogsStartIndex !== -1) {
          const newLogs = logData.logs.slice(newLogsStartIndex);
          return [...prevLogs, ...newLogs];
        }
        return prevLogs;
      });
    }
  }, [logData]);

  return (
    <>
      <div className="container mx-auto px-4 py-8 flex flex-col">
        <BuildLogs
          isDeployed={!!deploymentId}
          isLoadingLogs={isLoadingLogs}
          logs={logs}
        />
        <Button
          onClick={onDeploymentHandler}
          className="w-full mt-8"
          size={"lg"}
        >
          Deploy
        </Button>
      </div>
    </>
  );
}
