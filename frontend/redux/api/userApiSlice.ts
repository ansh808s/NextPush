import {
  AuthResponse,
  AuthCode,
  RepoResponse,
  GetRepoTreeResponse,
  GetRepoTreeProps,
} from "@/types/auth/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  endpoints: (builder) => ({
    createUser: builder.mutation<AuthResponse, AuthCode>({
      query: (code) => ({
        url: "/auth/signin",
        method: "POST",
        body: code,
      }),
    }),
    getRepo: builder.query<RepoResponse, { query: string } | null>({
      query: (args) => ({
        url: "/auth/repo",
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
        params: {
          query: args?.query || "",
        },
      }),
    }),
    getTree: builder.mutation<GetRepoTreeResponse, GetRepoTreeProps>({
      query: (info) => ({
        url: "/auth/tree",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token")!,
        },
        body: info,
      }),
    }),
  }),
});

export const { useCreateUserMutation, useGetRepoQuery, useGetTreeMutation } =
  userApiSlice;
