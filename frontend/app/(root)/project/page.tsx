"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Github, Plus, Search, Code, Calendar } from "lucide-react";
import { useGetUserProjectsQuery } from "@/redux/api/appApiSlice";
import moment from "moment";
import { useRouter } from "next/navigation";
import withAuth from "@/components/hoc/withAuth";

const ProjectsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [frameworkFilter, setFrameworkFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  //   TODO: Loading
  const { data: projects, isFetching: isProjectsLoading } =
    useGetUserProjectsQuery();
  const router = useRouter();

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFramework =
      frameworkFilter === "All" || project.framework === frameworkFilter;
    const matchesStatus =
      statusFilter === "All" || project.deployment[0].status === statusFilter;

    return matchesSearch && matchesFramework && matchesStatus;
  });

  const frameworks = [
    "All",
    ...new Set(projects?.map((project) => project.framework)),
  ];

  const statuses = [
    "All",
    ...new Set(projects?.map((project) => project.deployment[0].status)),
  ];

  const handleDashboardRedirect = (id: string) => {
    router.push(`/project/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Button
          onClick={() => router.push("/select-repo")}
          className="bg-rose-500 hover:bg-rose-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200 dark:border-gray-700"
          />
        </div>
        <div className="flex gap-4">
          <Select value={frameworkFilter} onValueChange={setFrameworkFilter}>
            <SelectTrigger className="w-[180px] capitalize">
              <SelectValue placeholder="Framework" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((framework) => (
                <SelectItem
                  className="capitalize"
                  key={framework}
                  value={framework}
                >
                  {framework.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] capitalize">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem className="capitalize" key={status} value={status}>
                  {status.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.map((project) => (
          <div
            onClick={() => handleDashboardRedirect(project.id)}
            key={project.id}
          >
            <Card className="h-full transition-all duration-300 hover:shadow-lg  border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-rose-500 hover:text-rose-600"
                    >
                      <a
                        href={`http://localhost:9000/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    </Button>
                    {project.gitURL && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <a
                          href={project.gitURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4 capitalize">
                  <Badge
                    className="border-rose-500 font-light"
                    variant={"outline"}
                  >
                    {project.deployment[0].status.toLowerCase()}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-rose-500 capitalize font-light"
                  >
                    <Code className="mr-1 h-3 w-3" /> {project.framework}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {project.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        Created:{" "}
                        {moment(project.createdAt).format("Do MMMM YYYY")}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => handleDashboardRedirect(project.id)}
                  className="w-full border-rose-500 text-rose-500 dark:bg-neutral-900 hover:bg-rose-50 dark:hover:bg-rose-900"
                >
                  View Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
export default withAuth(ProjectsDashboard);
