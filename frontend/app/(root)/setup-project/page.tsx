"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader, Edit2 } from "lucide-react";
import { SupportedFrameworks } from "@/config/constant";
import {
  SetupProjectFormData,
  formSchema,
} from "@/lib/schema/setupProjectSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DirectoryTree, { TreeNode } from "@/components/DirectoryTree";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetTreeMutation } from "@/redux/api/userApiSlice";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useCreateDeploymentMutation,
  useCreateProjectMutation,
  useGetDeploymentLogsQuery,
} from "@/redux/api/appApiSlice";
import React from "react";
import { LogEntry } from "@/types/app/types";
import BuildLogs from "@/components/BuildLogs";
import { toast } from "sonner";
import withAuth from "@/components/hoc/withAuth";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const SetupProject = () => {
  const params = useSearchParams();
  const router = useRouter();
  const repo = params.get("repo")!;
  const gitURL = params.get("git")!;
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [selectedRootDir, setSelectedRootDir] = useState<string>("");
  const [children, setChildren] = useState<TreeNode[] | null>(null);
  const [getTree, { isLoading: isLoadingTree }] = useGetTreeMutation();
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string>("");
  const [createProject] = useCreateProjectMutation();
  const [createDeployment] = useCreateDeploymentMutation();
  const [logs, setLogs] = useState<
    Pick<LogEntry, "type" | "timestamp" | "message">[]
  >([]);
  const { data: logData, isFetching: isLoadingLogs } =
    useGetDeploymentLogsQuery(deploymentId!, {
      skip: !deploymentId,
      pollingInterval: 4000,
    });

  const form = useForm<SetupProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: repo,
      framework: undefined,
      envVars: [{ key: "", value: "" }],
      rootDir: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = form;

  const handleSelectDirectory = (path: string) => {
    setSelectedRootDir(path);
    setValue("rootDir", path);
    setIsDirectoryModalOpen(false);
  };

  const onSubmit = async (data: SetupProjectFormData) => {
    try {
      toast.loading("Creating Project", { id: "project" });
      const project = await createProject({ ...data, gitURL }).unwrap();
      toast.success("Project Created", { id: "project" });
      toast.loading("Deploying", { id: "deploy" });
      setProjectId(project.project);
      const deployment = await createDeployment({
        projectId: project.project,
      }).unwrap();
      toast.info("Deployment Started", { id: "deploy" });
      setDeploymentId(deployment.deploymentId);
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError;
      let errMsg = "Something went wrong while fetching projects.";

      if (err.status === 400) {
        errMsg = "Please check your inputs";
      } else if (err.status === 403) {
        errMsg = "You can't create more than one project in free account";
      } else if (err.status === 500) {
        errMsg = "Server error: Please try again later";
      } else if (err.status === 409) {
        toast.error("Project name must be unique");
      }
      toast.error(errMsg, { id: "project" });
    }
  };
  // TODO:Improve this code
  useEffect(() => {
    if (!repo || !gitURL) {
      router.push("/select-repo");
      toast.error("Repository not selected");
    }
    const tree = async () => {
      try {
        const res = await getTree({ repo, sha: "main" }).unwrap();
        setChildren(res.tree);
      } catch (error: unknown) {
        const err = error as FetchBaseQueryError;
        let errMsg = "Something went wrong while fetching projects.";

        if (err.status === 400) {
          errMsg = `Bad request: Unable to load directory structure`;
        } else if (err?.status === 404) {
          errMsg = "User not found";
        } else if (err.status === 500) {
          errMsg = "Server error: Failed to fetch directory structure";
        }
        toast.error(errMsg);
      }
    };
    tree();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-rose-200 dark:border-rose-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Set Up Your Project
          </CardTitle>
          <CardDescription>
            Configure your project for deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Project Name</Label>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-gray-200 dark:border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="framework"
                render={({ field }) => (
                  <FormItem>
                    <Label>Framework</Label>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="border-gray-200 dark:border-gray-700">
                          <SelectValue placeholder="Select a framework" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SupportedFrameworks).map(
                            ([key, value]) => (
                              <SelectItem key={value} value={value}>
                                {key}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="rootDir"
                render={({ field }) => (
                  <FormItem>
                    <Label>Root Directory</Label>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          {...field}
                          className="border-gray-200 dark:border-gray-700"
                          disabled
                          value={selectedRootDir}
                        />
                        <Dialog
                          open={isDirectoryModalOpen}
                          onOpenChange={setIsDirectoryModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="ml-2 bg-dark-900"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Select Root Directory</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[300px] overflow-y-auto">
                              {isLoadingTree ? (
                                <>
                                  <Loader className="h-4 w-4 animate-spin" />
                                </>
                              ) : (
                                <DirectoryTree
                                  data={{
                                    path: "",
                                    sha: "main",
                                    children: children!,
                                  }}
                                  onSelect={handleSelectDirectory}
                                  selectedPath={selectedRootDir}
                                  repository={repo}
                                  currentPath={""}
                                />
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  "Deploy Project"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-8"></div>
      <BuildLogs
        isDeployed={!!deploymentId}
        isLoadingLogs={isLoadingLogs}
        logs={logs}
      />
    </div>
  );
};
export default withAuth(SetupProject);
