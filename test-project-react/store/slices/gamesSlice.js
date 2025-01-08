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
    updateGameStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateGameSuccess: (state, action) => {
      state.loading = false;
      state.game = action.payload;
    },
    updateGameFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createGameStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createGameSuccess: (state, action) => {
      state.loading = false;
      state.games.push(action.payload);
    },
    createGameFailure: (state, action) => {
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
  updateGameStart,
  updateGameSuccess,
  updateGameFailure,
  createGameStart,
  createGameSuccess,
  createGameFailure,
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

export const updateGame = (gameId, gameData) => async (dispatch) => {
  dispatch(updateGameStart());
  try {
    const response = await axios.put(
      `http://localhost:8000/api/games/${gameId}/edit`,
      gameData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(updateGameSuccess(response.data));
  } catch (error) {
    dispatch(updateGameFailure(error.response?.data || error.message));
  }
};

export const createGame = (gameData) => async (dispatch) => {
  dispatch(createGameStart());
  console.log(token);
  try {
    const response = await axios.get(
      "http://localhost:8000/api/games/store",
      gameData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(createGameSuccess(response.data));
  } catch (error) {
    dispatch(createGameFailure(error.response?.data || error.message));
  }
};

export const selectGames = (state) => state.games;

export default gamesSlice.reducer;
