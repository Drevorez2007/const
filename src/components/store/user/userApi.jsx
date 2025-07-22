import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://blog-platform.kata.academy/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.currentUser?.token;
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({

    register: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData, 
      }),
    }),

    login: builder.mutation({
      query: (userData) => ({
        url: "/users/login",
        method: "POST",
        body: userData, 
      }),
    }),

    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/user",
        method: "PUT",
        body: { user: userData },
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useUpdateUserMutation } =
  userApi;
