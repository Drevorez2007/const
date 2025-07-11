import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../../global/globalSlice"; 

const apiBase = "https://blog-platform.kata.academy/api";

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (
    { limit = 5, offset = 0 } = {},
    { rejectWithValue, getState, dispatch }
  ) => {
    const state = getState();
    const token = state.user.currentUser?.token;

    try {
      dispatch(setLoading(true)); 

      const response = await fetch(
        `${apiBase}/articles?limit=${limit}&offset=${offset}`,
        {
          headers: token ? { Authorization: `Token ${token}` } : {},
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false)); 
    }
  }
);
