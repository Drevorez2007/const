import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (userData, { rejectedValue }) => {
    try {
      const response = await fetch(
        'https://blog-platform.kata.academy/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: userData }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        return rejectedValue(data.error);
      }
      console.log('You login in acc:', data.user);
      return data.user;
    } catch (error) {
      return rejectedValue(error.message);
    }
  }
);
