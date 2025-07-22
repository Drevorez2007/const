
import { createSlice } from "@reduxjs/toolkit";

export const takeUserFromLocalStorage = () =>
  JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
  currentUser: takeUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
