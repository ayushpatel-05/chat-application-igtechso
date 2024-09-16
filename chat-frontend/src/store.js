import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import videoCallReducer from './slices/videoCallSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        videoCall: videoCallReducer
    },
})