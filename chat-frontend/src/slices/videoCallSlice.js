import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localMediaStream: null,
  remoteMediaStream: null,
};

const videoCallSlice = createSlice({
  name: "videoCall",
  initialState: initialState,
  reducers: {
    setLocalMediaStream(state, action) {
      state.localMediaStream = action.payload;
    },
    setRemoteMediaStream(state, action) {
      state.remoteMediaStream = action.payload;
    },
    clearMediaStreams(state) {
      // Stop all tracks of the local media stream
      if (state.localMediaStream) {
        state.localMediaStream.getTracks().forEach(track => track.stop());
        state.localMediaStream = null;
      }

      // Stop all tracks of the remote media stream
      if (state.remoteMediaStream) {
        state.remoteMediaStream.getTracks().forEach(track => track.stop());
        state.remoteMediaStream = null;
      }
    },
  },
});

export const { setLocalMediaStream, setRemoteMediaStream, clearMediaStreams } = videoCallSlice.actions;
export default videoCallSlice.reducer;
