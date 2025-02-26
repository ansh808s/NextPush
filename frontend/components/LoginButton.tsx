"use client";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function LoginButton() {
  const pathname = usePathname();
  const [avatar, setAvatar] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setAvatar(localStorage.getItem("avatar") || "");
    setToken(localStorage.getItem("token") || "");

    const handleStorageChange = () => {
      setAvatar(localStorage.getItem("avatar") || "");
      setToken(localStorage.getItem("token") || "");
    };

    window.addEventListener("localStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange);
    };
  }, []);

  const onLoginHandler = async () => {
    const clientId = "Ov23liyklq2na0wre79p";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${encodeURIComponent(
      pathname
    )}`;
  };

  const onLogoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");

    setToken("");
    setAvatar("");

    window.dispatchEvent(new Event("localStorageChange"));
  };

  return token ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="size-10 rounded-full overflow-hidden cursor-pointer">
          <Image
            src={avatar}
            alt="Profile"
            className="w-full h-full object-cover"
            width={40}
            height={40}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          className="cursor-pointer text-sm text-red-500"
          onClick={onLogoutHandler}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button onClick={onLoginHandler} variant="outline">
      Log in
    </Button>
  );
}
