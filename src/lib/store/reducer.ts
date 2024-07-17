import {
  PlaylistActionTypes,
  ADD_PLAYLIST,
  DELETE_ALL_PLAYLISTS,
  SELECT_PLAYLIST,
} from './actions';
import { initialState, PlaylistState } from '../types/Playlist.ts';

export const playlistReducer = (
  state = initialState,
  action: PlaylistActionTypes,
): PlaylistState => {
  switch (action.type) {
    case ADD_PLAYLIST:
      return { ...state, playlists: [...state.playlists, action.payload] };
    case DELETE_ALL_PLAYLISTS:
      return { ...state, playlists: [] };
    case SELECT_PLAYLIST:
      return { ...state, selectedPlaylist: action.payload };
    default:
      return state;
  }
};
