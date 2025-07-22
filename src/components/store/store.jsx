import { configureStore } from "@reduxjs/toolkit";
import { articleApi } from "./article/articleApi";
import { userApi } from "./user/userApi";
import userReducer from "./user/userReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    [articleApi.reducerPath]: articleApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(articleApi.middleware, userApi.middleware),
});

export default store;
