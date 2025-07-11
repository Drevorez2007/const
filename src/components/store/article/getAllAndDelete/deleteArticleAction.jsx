import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../../global/globalSlice"; 

export const deleteArticle = createAsyncThunk(
  "article/deleteArticle",
  async ({ slug }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(setLoading(true)); 

      const state = getState();
      const token = state.user.currentUser.token;
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(errorText || "Ошибка удаления");
      }

      return { slug };
    } catch (error) {
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false)); 
    }
  }
);
