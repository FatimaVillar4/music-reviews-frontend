import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import reviewsReducer from "./slices/reviewSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    reviews: reviewsReducer,
  },
});

export default store;