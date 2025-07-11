import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading } from '../../global/globalSlice';

export const favoritedLike = createAsyncThunk(
  'article/favoritedLike',
  async ({ slug, favorited }, { rejectWithValue, getState, dispatch }) => {
    const method = favorited ? 'DELETE' : 'POST';
    const token = getState().user.currentUser.token;
    try {
      dispatch(setLoading(true)); 

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
    } finally {
      dispatch(setLoading(false)); 
    }
  }
);
