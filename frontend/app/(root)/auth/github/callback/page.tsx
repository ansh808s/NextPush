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
        localStorage.setItem("avatar", userRes.data.avatar);
        localStorage.setItem("token", userRes.token);
        window.dispatchEvent(new Event("localStorageChange"));
        toast.success("Signed in successfully", { id: "signin" });
      } catch (error: unknown) {
        let errMsg = "Something went wrong during sign-in.";
        const err = error as FetchBaseQueryError;

        if (err.status === 400 && "data" in err) {
          errMsg = "Invalid input, please check your request.";
          console.error("Validation Error:", err.data);
        } else if (err.status === 404) {
          errMsg = "GitHub user not found or token missing.";
        } else if (err.status === 500) {
          errMsg = "Internal server error. Please try again later.";
        }

        toast.error(errMsg, { id: "signin" });
      } finally {
        if (redirectURL === "null") {
          router.push("/");
        } else {
          router.push(redirectURL);
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
