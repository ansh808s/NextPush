"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";
import { useGetRepoQuery } from "@/redux/api/userApiSlice";
import { Repository } from "@/types/auth/types";
import useDebounce from "@/hooks/useDebounce";

export default function SelectRepo() {
  const [search, setSearch] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const debouncedSearch = useDebounce(search, 400);
  const { data, error, isLoading } = useGetRepoQuery({
    query: debouncedSearch,
  });
  const router = useRouter();

  const handleSelectRepo = (repo: Repository) => {
    if (selectedRepo?.gitURL == repo.gitURL) {
      setSelectedRepo(null);
      return;
    }
    setSelectedRepo(repo);
  };

  const handleContinue = () => {
    if (selectedRepo) {
      router.push("/setup-project");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-rose-200 dark:border-rose-800">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Import GitHub Repository
          </CardTitle>
          <CardDescription>
            Select a repository to deploy from your GitHub account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-400" />
            <Input
              type="text"
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-rose-200 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          <div className="space-y-4">
            {data?.repos.map((repo) => (
              <Card
                key={repo.gitURL}
                className={`transition-all duration-300 hover:shadow-md cursor-pointer ${
                  selectedRepo?.gitURL === repo.gitURL
                    ? "border-rose-500 shadow-md"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => handleSelectRepo(repo)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="text-lg font-semibold">{repo.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {repo.description}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-6 h-6 transition-opacity ${
                      selectedRepo?.gitURL === repo.gitURL
                        ? "opacity-100 text-rose-500"
                        : "opacity-0"
                    }`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!selectedRepo}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
