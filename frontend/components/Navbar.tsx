"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import LoginButton from "./LoginButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Layers } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Ship-it
        </Link>

        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              ></Link>
            </li>
            <li>
              {" "}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-1 ${
                      isActive("/project")
                        ? "text-rose-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Project <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/project"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Layers className="h-4 w-4" /> View All Projects
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/select-repo"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Create New Project
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <LoginButton />
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
