import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const articleApi = createApi({
  reducerPath: "articleApi",
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
  tagTypes: ["Article", "Articles"],
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ limit, offset }) => `/articles?limit=${limit}&offset=${offset}`,
      providesTags: ["Articles"],
    }),

    getArticle: builder.query({
      query: (slug) => `/articles/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Article", id: slug }],
    }),

    createArticle: builder.mutation({
      query: (articleData) => ({
        url: "/articles",
        method: "POST",
        body: { article: articleData },
      }),
      invalidatesTags: ["Articles"],
    }),

    editArticle: builder.mutation({
      query: ({ slug, ...article }) => ({
        url: `/articles/${slug}`,
        method: "PUT",
        body: { article },
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Article", id: slug },
        "Articles",
      ],
    }),

    deleteArticle: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}`, 
        method: "DELETE",
      }),
      invalidatesTags: ["Articles"],
    }),

    toggleFavorite: builder.mutation({
      query: ({ slug, favorited }) => ({
        url: `/articles/${slug}/favorite`,
        method: favorited ? "DELETE" : "POST",
      }),
      async onQueryStarted({ slug }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            articleApi.util.invalidateTags([
              { type: "Article", id: slug },
              "Articles",
            ]),
          );
        } catch (err) {
          console.error("Ошибка при обновлении лайка", err);
        }
      },
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useEditArticleMutation,
  useDeleteArticleMutation,
  useToggleFavoriteMutation,
} = articleApi;
