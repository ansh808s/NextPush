"use client";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";

export default function LoginButton() {
  const pathname = usePathname();
  const onLoginHandler = async () => {
    const clientId = "Ov23liyklq2na0wre79p";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&state=${encodeURIComponent(
      pathname
    )}`;
  };

  return localStorage.getItem("avatar") ? (
    <div className="size-10 rounded-full overflow-hidden flex">
      <Image
        src={localStorage.getItem("avatar")!}
        alt="Profile Image"
        className="w-full h-full"
        height={40}
        width={40}
      />
    </div>
  ) : (
    <Button onClick={onLoginHandler} variant="outline">
      Log in
    </Button>
  );
}
