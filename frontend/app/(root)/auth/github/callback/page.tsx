"use client";

import React, { useEffect } from "react";
import { useCreateUserMutation } from "@/redux/api/userApiSlice";
import { useDispatch } from "react-redux";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { setUser } from "@/redux/slices/userSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export default function GithubAuthCallback() {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const redirectURL = decodeURIComponent(searchParams.get("state")!);
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!code || Array.isArray(code) || error) {
        toast.error("Access denied");
        if (redirectURL == "null") {
          router.push("/");
        } else {
          router.push(redirectURL);
        }
        return;
      }
      try {
        toast.loading("Signing in...", { id: "signin" });
        const userRes = await createUser({ code }).unwrap();
        dispatch(setUser(userRes.data));
        console.log("User response:", userRes);
        localStorage.setItem("avatar", userRes.data.avatar);
        localStorage.setItem("token", userRes.token);
        window.dispatchEvent(new Event("localStorageChange"));
        toast.success("Signed in successfully", { id: "signin" });
        if (redirectURL == "null") {
          router.push("/");
        } else {
          router.push(redirectURL);
        }
      } catch (error: unknown) {
        if (error && (error as FetchBaseQueryError).status == 404) {
          if (redirectURL == "null") {
            router.push("/");
          } else {
            router.push(redirectURL);
          }
          toast.error("Error fetching User details please try again", {
            id: "signin",
          });
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen ">
          <Loader className="w-16 h-16 animate-spin text-rose-500" />
        </div>
      )}
    </>
  );
}
