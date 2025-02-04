import { DeploymentResponse, DeploymentStatusFromApi } from "@/types/app/types";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/select";
import React, { useState } from "react";
import DeploymentItem from "./DeploymentItem";

interface IDeploymentTab {
  Deployments: DeploymentResponse[];
}

export default function DeploymentsTab(props: IDeploymentTab) {
  const [statusFilter, setStatusFilter] = useState<
    DeploymentStatusFromApi | "ALL"
  >("ALL");
  const filteredDeployments = props.Deployments.filter(
    (deployment) =>
      statusFilter === "ALL" ||
      (deployment.status as DeploymentStatusFromApi) === statusFilter
  );
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Deployment History</h3>
        <Select
          value={statusFilter}
          onValueChange={(value: DeploymentStatusFromApi) =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="READY">Success</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="QUEUED">Queued</SelectItem>
            <SelectItem value="NOT_STARTED">Not Started</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        {filteredDeployments.map((deployment) => (
          <DeploymentItem key={deployment.id} deployment={deployment} />
        ))}
      </div>
    </div>
  );
}
