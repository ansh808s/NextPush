"use client";
import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGetTreeMutation } from "@/redux/api/userApiSlice";

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
  const [getTree, { isLoading }] = useGetTreeMutation();

  const handleToggle = async () => {
    if (!isOpen && !children) {
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
      {isOpen && children && (
        <div className="ml-4">
          {children.map((child) => (
            <DirectoryTree
              key={child.sha}
              repository={repository}
              data={child}
              onSelect={onSelect}
              selectedPath={selectedPath}
              currentPath={fullPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
