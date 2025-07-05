import { createAsyncThunk } from '@reduxjs/toolkit';
const apiBase = 'https://blog-platform.kata.academy/api';
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ limit = 5, offset = 0 } = {}, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.user.currentUser?.token;
    try {
      const response = await fetch(
        `${apiBase}/articles?limit=${limit}&offset=${offset}`,
        {
          headers: token ? { Authorization: `Token ${token}` } : {},
        }
      );

      if (!response.ok) {
        throw new Error('Failet to fetch articles');
      }

      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
