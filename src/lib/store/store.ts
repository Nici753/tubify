import { configureStore } from '@reduxjs/toolkit';
import { playlistReducer } from './reducer';

export const store = configureStore({
  reducer: {
    playlists: playlistReducer,
  },
});
