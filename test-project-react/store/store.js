import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import gamesReducer from "./slices/gamesSlice";
import categoryReducer from "./slices/categorySlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gamesReducer,
    category: categoryReducer,
  },
});

export default store;
