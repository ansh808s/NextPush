import React from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
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
import { redirect } from "next/navigation";

interface IDashboardSettings {
  id: string;
}

export default function DashboardSettings(props: IDashboardSettings) {
  // TODO: Add loading and error state
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();

  const handleDeleteProject = async () => {
    await deleteProject({ projectId: props.id });
    redirect("/project");
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
        <DialogFooter>
          <Button onClick={handleDeleteProject} type="submit">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
