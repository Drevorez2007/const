import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../global/globalSlice";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));

      const response = await fetch(
        "https://blog-platform.kata.academy/api/users",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.errors || { message: "Unknown error" });
      }

      return data.user;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    } finally {
      dispatch(setLoading(false));
    }
  }
);
