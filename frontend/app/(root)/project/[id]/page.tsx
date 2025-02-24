"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Globe, ArrowUpRight, Zap } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetDeploymentLogsQuery,
  useGetProjectInfoQuery,
  useGetSiteVisitsQuery,
} from "@/redux/api/appApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import BuildLogs from "@/components/BuildLogs";
import { SupportedFrameworks } from "@/config/constant";
import {
  DaySiteVisits,
  deploymentResponseStatus,
  DeploymentStatusFromApi,
} from "@/types/app/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeploymentsTab from "@/components/DeploymentsTab";
import WeeklyVisitsChart from "@/components/WeeklyVisitsChart";
import DashBoardAnalytics from "@/components/DashBoardAnalytics";
import DashboardSettings from "@/components/DashboardSettings";

const DetailItem = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="mb-4">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <>{value}</>
  </div>
);

export default function Dashboard() {
  const params = useParams();
  const id = params.id! as string;
  const { data: projectData, isFetching: isProjectInfoLoading } =
    useGetProjectInfoQuery(id as string);
  const [deploymentId, setDeploymentId] = useState<string>("");

  useEffect(() => {
    if (!projectData) {
      return;
    }
    setDeploymentId(
      projectData.Deployment[projectData.Deployment.length - 1].id
    );
  }, [projectData]);

  const { data: logData, isFetching: isLoadingLogs } =
    useGetDeploymentLogsQuery(deploymentId, {
      skip: !deploymentId,
    });

  const { data: weeklyVisitsData, isFetching: isLoadingVisits } =
    useGetSiteVisitsQuery({
      id,
      type: "week",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  return (
    <div className="container mx-auto px-4 py-8">
      {isProjectInfoLoading || !projectData ? (
        <>
          <Skeleton className="w-full h-[50vh]" />
        </>
      ) : (
        <Card className="border-rose-200 dark:border-rose-800 overflow-hidden">
          <CardHeader className="border-b border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">
                {projectData.name}
              </CardTitle>
              <div className="flex space-x-2">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                  <Zap className="mr-2 h-4 w-4" /> Redeploy
                </Button>
                <DashboardSettings id={projectData?.id} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="deployments">Deployments</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="space-y-6 lg:col-span-3">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Project Details
                      </h3>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <DetailItem
                          label="Deployed Link"
                          value={
                            <Link
                              href={`http://${projectData.name}-${projectData.subDomain}.localhost:8000`}
                              className="text-rose-500 hover:underline flex items-center"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {`http://${projectData.name}-${projectData.subDomain}.localhost:8000`}{" "}
                              <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Link>
                          }
                        />
                        <div className="flex items-center gap-x-4">
                          <DetailItem
                            label="Status"
                            value={
                              <div className="flex items-center">
                                <p
                                  className={`${
                                    deploymentResponseStatus[
                                      projectData.Deployment[
                                        projectData.Deployment.length - 1
                                      ].status as DeploymentStatusFromApi
                                    ].color
                                  }`}
                                >
                                  {
                                    deploymentResponseStatus[
                                      projectData.Deployment[
                                        projectData.Deployment.length - 1
                                      ].status as DeploymentStatusFromApi
                                    ].label
                                  }
                                </p>
                              </div>
                            }
                          />
                          <DetailItem
                            label="Framework"
                            value={
                              <div className="flex items-center">
                                <span>
                                  {Object.keys(SupportedFrameworks).find(
                                    (key) =>
                                      SupportedFrameworks[
                                        key as keyof typeof SupportedFrameworks
                                      ] === projectData.framework
                                  )}
                                </span>
                              </div>
                            }
                          />
                        </div>
                        <DetailItem
                          label="Created At"
                          value={
                            <div className="flex items-center">
                              <span className="mr-2">
                                {`${new Date(projectData.createdAt)
                                  .getDate()
                                  .toString()} ${new Date(projectData.createdAt)
                                  .toLocaleString("default", { month: "long" })
                                  .toString()}`}{" "}
                                by {projectData.user.username}
                              </span>
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={projectData.user.avatarUrl}
                                  alt={projectData.user.username}
                                />
                                <AvatarFallback>
                                  {projectData.user.username}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                          href={`http://${projectData.name}-${projectData.subDomain}.localhost:8000`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="bg-rose-500 hover:bg-rose-600 text-white w-full">
                            <Globe className="mr-2 h-4 w-4" /> Visit Site
                          </Button>
                        </Link>
                        <Link
                          href={projectData.gitURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            className="border-rose-500 w-full dark:bg-neutral-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900"
                          >
                            <Github className="mr-2 h-4 w-4" /> View on GitHub
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">
                      Weekly Visits
                    </h3>
                    <div
                      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2"
                      style={{ height: "300px" }}
                    >
                      <WeeklyVisitsChart
                        labels={false}
                        loading={isLoadingVisits}
                        weeklyVisitData={
                          weeklyVisitsData?.visits as DaySiteVisits[]
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-7 ">
                  <h3 className="text-lg font-semibold mb-4">
                    Recent Deployment Logs
                  </h3>
                  {!logData || isLoadingLogs ? (
                    <></>
                  ) : (
                    <BuildLogs
                      isLoadingLogs={isLoadingLogs}
                      logs={logData.logs}
                      isDeployed={true}
                      isDashboardDisplay={true}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="deployments">
                <DeploymentsTab Deployments={projectData.Deployment} />
              </TabsContent>

              <TabsContent value="analytics">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Analytics Overview
                    </h3>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <DashBoardAnalytics projectId={id} />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
