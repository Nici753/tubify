import { Playlist } from '../types/playlist';

export const ADD_PLAYLIST = 'ADD_PLAYLIST';

interface AddPlaylistAction {
  type: typeof ADD_PLAYLIST;
  payload: Playlist;
}

export type PlaylistActionTypes = AddPlaylistAction;

export const addPlaylist = (playlist: Playlist): PlaylistActionTypes => {
  return {
    type: ADD_PLAYLIST,
    payload: playlist,
  };
};
