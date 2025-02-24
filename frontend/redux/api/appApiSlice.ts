import {
  CreateDeploymentProps,
  CreateDeploymentResponse,
  CreateProjectProps,
  CreateProjectResponse,
  DeleteProjectProps,
  DeleteProjectResponse,
  GetDeploymentLogsResponse,
  GetProjectInfoResponse,
  GetRouteVisitsProps,
  GetRouteVisitsResponse,
  GetSiteVisitsDayResponse,
  GetSiteVisitsProps,
  GetSiteVisitsWeekResponse,
  GetUserProjectsResponse,
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
    getDeploymentLogs: builder.query<GetDeploymentLogsResponse, string>({
      query: (id) => ({
        url: `/app/logs/${id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
      }),
    }),
    getProjectInfo: builder.query<GetProjectInfoResponse, string>({
      query: (id) => ({
        url: `app/project/${id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
      }),
    }),
    getSiteVisits: builder.query<
      GetSiteVisitsDayResponse | GetSiteVisitsWeekResponse,
      GetSiteVisitsProps
    >({
      query: (queryProps) => ({
        url: "app/site-visits",
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
        params: {
          type: queryProps.type,
          id: queryProps.id,
          timezone: queryProps.timezone,
        },
      }),
    }),
    getRouteVisits: builder.query<GetRouteVisitsResponse, GetRouteVisitsProps>({
      query: (queryProps) => ({
        url: "app/route-visits",
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
        params: {
          type: queryProps.type,
          id: queryProps.id,
        },
      }),
    }),
    getUserProjects: builder.query<GetUserProjectsResponse[], void>({
      query: () => ({
        url: "app/project",
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
      }),
    }),
    deleteProject: builder.mutation<DeleteProjectResponse, DeleteProjectProps>({
      query: (queryProps) => ({
        url: `/app/project/${queryProps.projectId}`,
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
      }),
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useCreateDeploymentMutation,
  useGetDeploymentLogsQuery,
  useGetProjectInfoQuery,
  useLazyGetDeploymentLogsQuery,
  useGetSiteVisitsQuery,
  useGetRouteVisitsQuery,
  useGetUserProjectsQuery,
  useDeleteProjectMutation,
} = appApiSLice;
