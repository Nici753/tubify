import { configureStore } from '@reduxjs/toolkit';
import { playlistReducer } from './reducer';
import { loadFromLocalStorage, saveToLocalStorage } from './local-storage';

const preloadedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    playlists: playlistReducer,
  },
  preloadedState,
});

store.subscribe(() => saveToLocalStorage(store.getState()));
