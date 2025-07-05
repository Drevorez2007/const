import { createAsyncThunk } from '@reduxjs/toolkit';

export const editUser = createAsyncThunk(
  'user/editUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.currentUser.token;
      console.log('Отправка данных на сервер: ', { userData, token });
      const response = await fetch(
        'https://blog-platform.kata.academy/api/user',
        {
          method: 'PUT',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: userData }),
        }
      );
      console.log('Статус ответа от сервера: ', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
