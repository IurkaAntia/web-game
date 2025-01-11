import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  category: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    fetchCategoryStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategorySuccess(state, action) {
      state.loading = false;
      state.category = action.payload;
    },
    fetchCategoryFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCategoryStart,
  fetchCategorySuccess,
  fetchCategoryFailure,
} = categorySlice.actions;

export const fetchCategory = () => async (dispatch) => {
  const token = localStorage.getItem("auth_token");

  try {
    dispatch(fetchCategoryStart());

    const response = await axios.get("http://localhost:8000/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(fetchCategorySuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    dispatch(fetchCategoryFailure(errorMessage));
  }
};

export default categorySlice.reducer;
