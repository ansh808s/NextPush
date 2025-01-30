import {
  CreateDeploymentProps,
  CreateDeploymentResponse,
  CreateProjectProps,
  CreateProjectResponse,
} from "@/types/app/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApiSLice = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    createProject: builder.mutation<CreateProjectResponse, CreateProjectProps>({
      query: (info) => ({
        url: "/app/project",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
        body: info,
      }),
    }),
    createDeployment: builder.mutation<
      CreateDeploymentResponse,
      CreateDeploymentProps
    >({
      query: (info) => ({
        url: "/app/deploy",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
        body: info,
      }),
    }),
  }),
});

export const { useCreateProjectMutation, useCreateDeploymentMutation } =
  appApiSLice;
