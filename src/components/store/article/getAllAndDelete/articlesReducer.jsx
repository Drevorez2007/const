import { createSlice } from '@reduxjs/toolkit';
import { fetchArticles } from './articlesActions';
import { deleteArticle } from './deleteArticleAction';
import { favoritedLike } from '../favoritedLike/favoritedLikeAction';

const initialState = {
  articles: [],
  articlesCount: 0,
  currentPage: 1,
  loading: false,
  error: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles;
        state.articlesCount = action.payload.articlesCount;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        const slugDelete = action.meta.arg.slug;
        state.articles = state.articles.filter(
          (article) => article.slug !== slugDelete
        );
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(favoritedLike.fulfilled, (state, action) => {
        const updateArticle = action.payload.article;
        const index = state.articles.findIndex(
          (article) => article.slug === updateArticle.slug
        );
        if (index !== -1) {
          state.articles[index] = {
            ...state.articles[index],
            favorited: updateArticle.favorited,
            favoritesCount: updateArticle.favoritesCount,
          };
        }
      });
  },
});

export const { setCurrentPage } = articlesSlice.actions;
export default articlesSlice.reducer;
