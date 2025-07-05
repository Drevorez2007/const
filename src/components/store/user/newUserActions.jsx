import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error);
      }
      console.log('New acc sucsess created:', data);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
