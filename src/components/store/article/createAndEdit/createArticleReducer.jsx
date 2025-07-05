import { createSlice } from '@reduxjs/toolkit';
import { createPost } from './createArticleAction';
import { editArticle } from './editArticleAction';

const initialState = {
  title: '',
  description: '',
  body: '',
  tagList: [''],
  loading: false,
  error: null,
};

const createArticleSlice = createSlice({
  name: 'createArticle',
  initialState,
  reducers: {
    setTitle(state, action) {
      state.title = action.payload;
    },
    setDescription(state, action) {
      state.description = action.payload;
    },
    setBody(state, action) {
      state.body = action.payload;
    },
    setTagList(state, action) {
      state.tagList = action.payload;
    },
    addTag(state, action) {
      state.tagList = [...state.tagList, action.payload];
    },
    removeTag(state, action) {
      state.tagList = state.tagList.filter(
        (_, index) => index !== action.payload
      );
    },
    resetArticleForm(state) {
      state.title = '';
      state.description = '';
      state.body = '';
      state.tagList = [''];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false;
        state.title = '';
        state.description = '';
        state.body = '';
        state.tagList = [];
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editArticle.pending, (state) => {
        state.loading = true;
      })
      .addCase(editArticle.fulfilled, (state, action) => {
        const article = action.payload;
        state.title = article.title;
        state.description = article.description;
        state.body = article.body;
        state.tagList = article.tagList || [];
        state.loading = false;
        state.error = null;
      });
  },
});
export const {
  setTitle,
  setDescription,
  setBody,
  addTag,
  removeTag,
  setTagList,
  resetArticleForm,
} = createArticleSlice.actions;
export default createArticleSlice.reducer;
