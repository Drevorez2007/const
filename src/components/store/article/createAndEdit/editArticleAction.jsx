import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../../global/globalSlice";

export const editArticle = createAsyncThunk(
  "articles/editArticle",
  async (
    { slug, title, description, body, tagList },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState();
      const token = state.user.currentUser.token;
      console.log("Sending article data:", {
        title,
        description,
        body,
        tagList: tagList,
      });

      dispatch(setLoading(true));
      
      const response = await fetch(
        `https://blog-platform.kata.academy/api/articles/${slug}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
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
      return data.article;
    } catch (error) {
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);
