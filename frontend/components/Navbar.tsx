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
import { ChevronDown, Menu, Plus, Layers, Github } from "lucide-react";
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

  const isActive = (...paths: string[]) => {
    return paths.includes(pathname);
  };

  return (
    <header className="border-b flex">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Ship-it
          </Link>
          <Button
            variant="outline"
            size="icon"
            asChild
            className="text-neutral-300 hover:text-neutral-400 ml-3"
          >
            <a
              href="https://github.com/ansh808s/NextPush"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
        </div>

        <nav className="md:block hidden">
          <ul className="flex space-x-4 items-center">
            <li>
              {" "}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-1 ${
                      isActive("/project", "/select-repo")
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
              <Link
                className={`flex items-center gap-1 font-medium text-sm -ml-4 ${
                  isActive("/pricing")
                    ? "text-rose-500"
                    : "text-gray-700 dark:text-gray-300"
                }`}
                href="/pricing"
              >
                Pricing
              </Link>
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
        <div className="md:hidden">
          <LoginButton />
        </div>
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
                href="/project"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                View All Projects
              </Link>
              <Link
                href="/select-repo"
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
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
