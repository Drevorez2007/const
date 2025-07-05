import { createAsyncThunk } from '@reduxjs/toolkit';

export const favoritedLike = createAsyncThunk(
  'article/favoritedLike',
  async ({ slug, favorited }, { rejectWithValue, getState }) => {
    const method = favorited ? 'DELETE' : 'POST';
    const token = getState().user.currentUser.token;
    try {
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}/favorite`,
        {
          method,
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
