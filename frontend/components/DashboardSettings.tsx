"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Trash2, Loader, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteProjectMutation } from "@/redux/api/appApiSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface IDashboardSettings {
  id: string;
}

export default function DashboardSettings({ id }: IDashboardSettings) {
  const [deleteProject, { isLoading, error }] = useDeleteProjectMutation();
  const [hasError, setHasError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!error) return;

    const err = error as FetchBaseQueryError;
    setHasError(true);

    let errMsg = "Failed to delete project.";

    if (err.status === 400) {
      errMsg = "Bad request: Project ID missing or invalid.";
    } else if (err.status === 404) {
      errMsg = "Project not found.";
    } else if (err.status === 500) {
      errMsg = "Server error: Could not delete the project.";
    }

    toast.error(errMsg);
  }, [error]);

  const handleDeleteProject = async () => {
    setHasError(false);
    try {
      await deleteProject({ projectId: id }).unwrap();
      router.push("/project");
    } catch {}
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-rose-500 text-rose-500 dark:bg-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-900"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to delete this
            project?
          </DialogDescription>
        </DialogHeader>

        {hasError && (
          <div className="flex items-center text-rose-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            Failed to delete project. Try again.
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleDeleteProject}
            disabled={isLoading}
            type="submit"
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
