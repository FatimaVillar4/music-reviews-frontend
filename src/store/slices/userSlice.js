import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  isLogged: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const { username } = action.payload;
      state.username = username;
      state.isLogged = true;
    },
    logoutUser: (state) => {
      state.username = "";
      state.isLogged = false;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
