import { Repository, User } from "@/types/auth/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  repo: Repository[];
}

const initialState: UserState = {
  user: null,
  repo: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setRepo: (state, action: PayloadAction<Repository[]>) => {
      state.repo = action.payload;
    },
  },
});

export const { setUser, setRepo } = userSlice.actions;
export default userSlice.reducer;
