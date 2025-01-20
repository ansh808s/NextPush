import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { userApiSlice } from "./api/userApiSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
