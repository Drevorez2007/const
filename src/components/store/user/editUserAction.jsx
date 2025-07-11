import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../global/globalSlice"; 

export const editUser = createAsyncThunk(
  "user/editUser",
  async (userData, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const token = state.user.currentUser.token;

      dispatch(setLoading(true)); 

      const response = await fetch(
        "https://blog-platform.kata.academy/api/user",
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: userData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading(false)); 
    }
  }
);
