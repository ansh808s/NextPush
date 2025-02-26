"use client";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  Loader,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGetTreeMutation } from "@/redux/api/userApiSlice";
import { toast } from "sonner";

export type TreeNode = {
  path: string;
  children?: TreeNode[];
  sha: string;
};

type DirectoryTreeProps = {
  data: TreeNode;
  onSelect: (path: string) => void;
  repository: string;
  selectedPath: string;
  currentPath?: string;
};

export default function DirectoryTree({
  data,
  onSelect,
  selectedPath,
  repository,
  currentPath,
}: DirectoryTreeProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<TreeNode[] | null>(
    data.children || null
  );
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [getTree, { isLoading, error }] = useGetTreeMutation();

  useEffect(() => {
    if (error) {
      const errorObject = error as any;
      setFetchError(true);
      if (errorObject?.status === 400) {
        toast.error(`Bad request: Unable to load directory structure`);
      } else if (errorObject?.status === 404) {
        toast.error("User not found");
      } else if (errorObject?.status === 500) {
        toast.error("Server error: Failed to fetch directory structure");
      } else {
        toast.error("Failed to load directory structure");
      }

      console.error("Directory tree fetch error:", errorObject);
    }
  }, [error]);

  const handleToggle = async () => {
    if (!isOpen && !children) {
      setFetchError(false);
      try {
        const response = await getTree({
          repo: repository,
          sha: data.sha,
        }).unwrap();
        setChildren(response.tree);
      } catch (error) {
        console.error("Failed to fetch directory tree:", error);
      }
    }
    setIsOpen(!isOpen);
  };

  const fullPath = `${currentPath}/${data.path}`.replace(/^\/+/, "");

  return (
    <div className="ml-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="p-0 h-6 w-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : fetchError ? (
            <AlertCircle className="h-4 w-4 text-rose-500" />
          ) : isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <Folder className="h-4 w-4 text-rose-500 mr-2" />
        <Label htmlFor={fullPath} className="mr-3">
          {data.path == "" ? repository : data.path}
        </Label>
        <RadioGroup
          value={selectedPath}
          onValueChange={onSelect}
          className="flex items-center"
        >
          <RadioGroupItem value={fullPath} id={fullPath} />
        </RadioGroup>
      </div>
      {isOpen && (
        <div className="ml-4">
          {fetchError ? (
            <div className="text-rose-500 text-sm py-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Failed to load contents.
              <Button
                variant="link"
                className="text-rose-400 p-0 ml-1 h-auto"
                onClick={() => handleToggle()}
              >
                Retry
              </Button>
            </div>
          ) : children && children.length > 0 ? (
            children.map((child) => (
              <DirectoryTree
                key={child.sha}
                repository={repository}
                data={child}
                onSelect={onSelect}
                selectedPath={selectedPath}
                currentPath={fullPath}
              />
            ))
          ) : children && children.length === 0 ? (
            <div className="text-gray-500 text-sm py-2">Empty directory</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
