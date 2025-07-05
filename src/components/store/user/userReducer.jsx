import { createSlice } from '@reduxjs/toolkit';
import { registerUser } from './newUserActions';
import { loginUser } from './loginUserActions';
import { editUser } from './editUserAction';

const initialState = {
  currentUser: null,
  nowLoading: false,
  error: null,
  isLogin: false,
  userLoaded: false,
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      state.isLogin = false;
      localStorage.removeItem('user');
    },
    takeUserFromLocalStorage(state, action) {
      state.currentUser = action.payload;
      state.isLogin = true;
      state.userLoaded = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.nowLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.nowLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.nowLoading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.nowLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.nowLoading = false;
        state.currentUser = action.payload;
        state.isLogin = true;

        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.nowLoading = false;
        state.error = action.payload;
      })

      .addCase(editUser.pending, (state) => {
        state.nowLoading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.nowLoading = false;
        state.currentUser = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(editUser.rejected, (state, action) => {
        state.nowLoading = false;
        state.error = action.payload;
      });
  },
});
export const { logout, takeUserFromLocalStorage } = usersSlice.actions;
export default usersSlice.reducer;
