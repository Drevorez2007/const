import { createAsyncThunk } from '@reduxjs/toolkit';

export const createPost = createAsyncThunk(
  'createArticle/createPost',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.user.currentUser.token;
      const { title, description, body, tagList } = state.createArticle;
      const response = await fetch(
        'https://blog-platform.kata.academy/api/articles',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            article: {
              title,
              description,
              body,
              tagList: tagList,
            },
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error);
      }
      console.log('Successfully created article:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
