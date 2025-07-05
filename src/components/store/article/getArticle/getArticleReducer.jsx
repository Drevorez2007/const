import { createSlice } from '@reduxjs/toolkit';
import { getArticle } from './getArticleAction';
import { favoritedLike } from '../favoritedLike/favoritedLikeAction';

const initialState = {
  title: '',
  description: '',
  body: '',
  tagList: [''],
  author: null,
  slug: '',
  createdAt: '',
  favorited: false,
  favoritesCount: 0,
  loading: false,
  error: null,
};

const getArticleReducer = createSlice({
  name: 'getArticle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArticle.fulfilled, (state, action) => {
        state.loading = false;
        const article = action.payload;
        state.title = article.title;
        state.description = article.description;
        state.body = article.body;
        state.tagList = article.tagList || [];
        state.author = article.author;
        state.slug = article.slug;
        state.createdAt = article.createdAt;
        state.favorited = article.favorited;
        state.favoritesCount = article.favoritesCount;
      })
      .addCase(getArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(favoritedLike.fulfilled, (state, action) => {
        const article = action.payload.article;
        state.favorited = article.favorited;
        state.favoritesCount = article.favoritesCount;
      });
  },
});

export default getArticleReducer.reducer;
