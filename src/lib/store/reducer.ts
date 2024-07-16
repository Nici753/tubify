import { PlaylistState, initialState } from '../types/Playlist';
import { PlaylistActionTypes, ADD_PLAYLIST } from './actions';

export const playlistReducer = (
  state = initialState,
  action: PlaylistActionTypes
): PlaylistState => {
  switch (action.type) {
    case ADD_PLAYLIST:
      return { ...state, playlists: [...state.playlists, action.payload] };
    default:
      return state;
  }
};