import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch the list of people
export const fetchPeople = createAsyncThunk(
  'chat/fetchPeople',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/people');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch chat history with a specific person
export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (personId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/chats/${personId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    people: [],
    chatHistory: [],
    selectedPersonId: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectPerson: (state, action) => {
      state.selectedPersonId = action.payload;
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
      state.selectedPersonId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeople.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeople.fulfilled, (state, action) => {
        state.people = action.payload;
        state.loading = false;
      })
      .addCase(fetchPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch people';
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.chatHistory = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch chat history';
      });
  },
});

export const { selectPerson, clearChatHistory } = chatSlice.actions;

export default chatSlice.reducer;
