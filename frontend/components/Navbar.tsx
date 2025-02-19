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
import { ChevronDown, Menu, Plus, Layers } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="border-b flex">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Ship-it
        </Link>

        <nav className="md:block hidden">
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
      <div className="flex items-center gap-4 mr-3">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTitle className="sr-only">Nav menu</SheetTitle>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="!h-7 !w-7" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/projects"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                View All Projects
              </Link>
              <Link
                href="/import-repository"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                Create New Project
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />
              <button className="flex items-center gap-2 text-left">
                Logout
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
