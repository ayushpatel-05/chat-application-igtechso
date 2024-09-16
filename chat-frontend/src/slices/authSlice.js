import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";






const checkAuthentication = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  return token ? true : false;
};


const getUserData = () => {
  if(checkAuthentication) {
    const userData = JSON.parse(localStorage.getItem('User'));
    return userData;
  }
  else
    return null;
}



// Async thunk to handle register
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        "http://localhost:3000/api/v1/register", // Assuming this is your registration endpoint
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);




// Async thunk to handle login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        "http://localhost:3000/api/v1/login",
        userData
      );
      localStorage.setItem("User", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        "http://localhost:3000/api/v1/logout"
      );
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
    user: getUserData(),
    isAuthenticated: checkAuthentication(),
  },
  reducers: {
    // logout: (state) => {
    //   state.user = null;
    //   state.isAuthenticated = false;
    //   state.loading = false;
    //   state.error = null;
    //   //Also delete local storage
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      // Handling register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      .addCase(logout.pending, (state) => {
        state.loading = true,
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});



// export const { logout } = authSlice.actions;

export default authSlice.reducer;
