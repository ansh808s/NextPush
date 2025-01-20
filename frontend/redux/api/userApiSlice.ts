import { AuthResponse, AuthToken } from "@/types/auth/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  endpoints: (builder) => ({
    createUser: builder.mutation<AuthResponse, AuthToken>({
      query: (code) => ({
        url: "/auth/signin",
        method: "POST",
        body: code,
      }),
    }),
  }),
});

export const { useCreateUserMutation } = userApiSlice;
