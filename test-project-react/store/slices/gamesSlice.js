import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("auth_token");

const gamesSlice = createSlice({
  name: "games",
  initialState: {
    games: [],
    game: null,
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
    fetchGameByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchGameByIdSuccess: (state, action) => {
      state.loading = false;
      state.game = action.payload;
    },
    fetchGameByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchGamesStart,
  fetchGamesSuccess,
  fetchGamesFailure,
  fetchGameByIdStart,
  fetchGameByIdSuccess,
  fetchGameByIdFailure,
} = gamesSlice.actions;

// Thunks
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

export const fetchGameById = (gameId) => async (dispatch) => {
  dispatch(fetchGameByIdStart());
  try {
    const response = await axios.get(
      `http://localhost:8000/api/games/${gameId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(fetchGameByIdSuccess(response.data));
  } catch (error) {
    dispatch(fetchGameByIdFailure(error.response?.data || error.message));
  }
};

export const selectGames = (state) => state.games;

export default gamesSlice.reducer;
