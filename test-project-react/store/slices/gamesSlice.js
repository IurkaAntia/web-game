import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("auth_token");

const gamesSlice = createSlice({
  name: "games",
  initialState: {
    games: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchGamesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchGamesSuccess: (state, action) => {
      state.loading = false;
      state.games = action.payload;
    },
    fetchGamesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Actions generated from the slice
export const { fetchGamesStart, fetchGamesSuccess, fetchGamesFailure } =
  gamesSlice.actions;

// Thunk to fetch games
export const fetchGames = () => async (dispatch) => {
  dispatch(fetchGamesStart());
  try {
    const response = await axios.get("http://localhost:8000/api/games", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(fetchGamesSuccess(response.data));
  } catch (error) {
    dispatch(fetchGamesFailure(error.response?.data || error.message));
  }
};

// Selector to access games from the state
export const selectGames = (state) => state.games;

// Export the reducer
export default gamesSlice.reducer;
