import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading } from "../global/globalSlice"; 

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true)); 

      const response = await fetch(
        "https://blog-platform.kata.academy/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: userData }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.errors || { message: "Ошибка входа" });
      }

      console.log("Вы вошли в аккаунт:", data.user);
      return data.user;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    } finally {
      dispatch(setLoading(false)); 
    }
  }
);
