import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../../global/globalSlice"; 

export const getArticle = createAsyncThunk(
  "article/getArticle",
  async ({ slug }, { rejectWithValue, getState, dispatch }) => {
    const state = getState();
    const token = state.user.currentUser?.token;

    try {
      dispatch(setLoading(true)); 

      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          headers: token ? { Authorization: `Token ${token}` } : {},
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error);
      }

      return data.article;
    } catch (error) {
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false)); 
    }
  }
);
