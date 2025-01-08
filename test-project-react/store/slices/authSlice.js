import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  token: localStorage.getItem("auth_token") || null,
  isAuthenticated: !!localStorage.getItem("auth_token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    authFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("auth_token");
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const { authStart, authSuccess, authFailure, logout, setUser } =
  authSlice.actions;

// Login action
export const login =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token in local storage
      localStorage.setItem("auth_token", token);

      dispatch(authSuccess({ user, token }));
    } catch (error) {
      dispatch(authFailure(error.response?.data || "Failed to log in"));
    }
  };

// Register action
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token in local storage
      localStorage.setItem("auth_token", token);

      dispatch(authSuccess({ user, token }));
    } catch (error) {
      dispatch(authFailure(error.response?.data || "Failed to register"));
    }
  };

// Check if the user is logged in
export const fetchUser = () => async (dispatch) => {
  dispatch(authStart());
  const token = localStorage.getItem("auth_token");
  if (!token) {
    dispatch(logout());
    return;
  }

  try {
    const response = await axios.get("http://localhost:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setUser(response.data));
  } catch (error) {
    dispatch(authFailure(error.response?.data || "Failed to fetch user data"));
    dispatch(logout());
  }
};

export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
