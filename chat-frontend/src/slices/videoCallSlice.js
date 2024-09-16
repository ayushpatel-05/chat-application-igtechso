import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localMediaStream: null,
  remoteMediaStream: null,
};

const videoCallSlice = createSlice({
  name: "videoCall",
  initialState: initialState,
  reducers: {
    // Action to set local media stream
    setLocalMediaStream(state, action) {
      state.localMediaStream = action.payload;
    },
    // Action to set remote media stream
    setRemoteMediaStream(state, action) {
      state.remoteMediaStream = action.payload;
    },
    // Action to clear both media streams
    clearMediaStreams(state) {
      state.localMediaStream = null;
      state.remoteMediaStream = null;
    },
  },
});

export const { setLocalMediaStream, setRemoteMediaStream, clearMediaStreams } = videoCallSlice.actions;
export default videoCallSlice.reducer;
