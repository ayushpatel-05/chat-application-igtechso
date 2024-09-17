import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { useParams } from 'react-router-dom';
axios.defaults.withCredentials = true;


// const getSelectedConversationId = () => {
//   const {chatID} = useParams();
//   console.log(chatID);
//   return null;
// }

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


export const deleteChat = createAsyncThunk(
  'chat/deleteMessages',
  async ({messageList, conversationID}, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/chats/${conversationID}`, { data: {
        chatIDs: messageList
      } });
      return {messageList, conversationID}
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete messages');
    }
  }
);


// Async thunk to fetch the list of people
export const fetchPeople = createAsyncThunk(
  'chat/fetchPeople',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/chats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch chat history with a specific person
export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (conversationID, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/chats/${conversationID}`);
      return { chatHistory: response.data, conversationID };
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
    newChatId: null
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
      // console.log("Called: " );
      state.chatHistory[action.payload.conversationID].push(action.payload.message);
    },
    // createNewChat: (state, action) => {

    // }
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
        const { chatHistory, conversationID } = action.payload;
        state.chatHistory[conversationID] = chatHistory;
        state.currentPersonId = conversationID;
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
        state.selectedConversationID = action.payload._id;
        state.newChatId = action.payload._id;
        state.chatHistory[action.payload._id] = [];
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create new chat';
      })
      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        const { messageList, conversationID } = action.payload;

        state.loading = false;

        if (state.chatHistory[conversationID]) {
          state.chatHistory[conversationID] = state.chatHistory[conversationID].filter(
            (message) => !messageList.includes(message._id)
          );
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete new chat';
      })
  },
});

export const { selectPerson, clearChatHistory, pushNewMessage } = chatSlice.actions;

export default chatSlice.reducer;
