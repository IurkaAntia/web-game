import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define initial state
const initialState = {
  category: [],
  loading: false,
  error: null,
};

// Create the slice
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // Action to start loading categories
    fetchCategoryStart(state) {
      state.loading = true;
      state.error = null;
    },
    // Action to set categories to the state
    fetchCategorySuccess(state, action) {
      state.loading = false;
      state.category = action.payload;
    },
    // Action to set error
    fetchCategoryFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  fetchCategoryStart,
  fetchCategorySuccess,
  fetchCategoryFailure,
} = categorySlice.actions;

// Create the async function to fetch categories with try-catch
export const fetchCategory = () => async (dispatch) => {
  const token = localStorage.getItem("auth_token");

  try {
    dispatch(fetchCategoryStart()); // Dispatch loading state

    const response = await axios.get("http://localhost:8000/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }); // Update with your API URL

    dispatch(fetchCategorySuccess(response.data)); // Dispatch success with categories
  } catch (error) {
    // Handle error using the catch block
    const errorMessage = error.response?.data || error.message;
    dispatch(fetchCategoryFailure(errorMessage)); // Dispatch error
  }
};

// Export reducer
export default categorySlice.reducer;
