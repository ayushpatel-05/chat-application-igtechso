import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";






const checkAuthentication = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  return token ? true : false;
};



// Async thunk to handle login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        "http://localhost:3000/api/v1/login",
        userData,
        {
          // withCredntials: true,
          // credentials: 'include'
          // credentials: 'include'
        }
      );
      console.log("Sending the request");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...initialState,
    isAuthenticated: checkAuthentication()
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Reaching here");
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
