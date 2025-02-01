import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { userApiSlice } from "./api/userApiSlice";
import { appApiSLice } from "./api/appApiSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [appApiSLice.reducerPath]: appApiSLice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      appApiSLice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
