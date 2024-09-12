import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
axios.defaults.withCredentials = true;




// Async thunk to createChat
export const createChat = createAsyncThunk(
  'chat/createChat',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/v1/chats/create/${userId}`);
      return response.data; // Return the created chat details
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue('User not found');
      }
      return rejectWithValue(error.response.data || 'Failed to create chat');
    }
  }
);





// Async thunk to fetch the list of people
export const fetchPeople = createAsyncThunk(
  'chat/fetchPeople',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/chats');
      console.log("The people list is: ", response.data);
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
      console.log(response);
      return { chatHistory: response.data, personId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    people: [],
    chatHistory: {},
    selectedConversationID: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectPerson: (state, action) => {
      state.selectedConversationID = action.payload;
    },
    clearChatHistory: (state) => {//Change Later for clear chats to be person specific
      state.chatHistory = {};
      state.selectedConversationID = null;
    },
    pushNewMessage: (state, action) => {
      state.chatHistory[action.payload.conversationID].push(action.payload.message);
    }
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
        const { chatHistory, personId } = action.payload;
        state.chatHistory[personId] = chatHistory;
        state.currentPersonId = personId;
        state.loading = false;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch chat history';
      })
      .addCase(createChat.pending, (state) => {
        state.loading = true,
        state.error = false
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        state.people.push(action.payload);
        state.selectedConversationID = action.payload.conversationID;
        state.chatHistory[action.payload.conversationID] = [];
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create new chat';
      });
  },
});

export const { selectPerson, clearChatHistory, pushNewMessage } = chatSlice.actions;

export default chatSlice.reducer;
