import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import gamesReducer from "./slices/gamesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gamesReducer,
  },
});

export default store;
