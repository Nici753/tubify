import { Playlist } from '../types/Playlist';

export const ADD_PLAYLIST = 'ADD_PLAYLIST';
export const DELETE_ALL_PLAYLISTS = 'DELETE_ALL_PLAYLISTS';
export const SELECT_PLAYLIST = 'SELECT_PLAYLIST';

interface AddPlaylistAction {
  type: typeof ADD_PLAYLIST;
  payload: Playlist;
}

interface DeleteAllPlaylistsAction {
  type: typeof DELETE_ALL_PLAYLISTS;
}

interface SelectPlaylistAction {
  type: typeof SELECT_PLAYLIST;
  payload: Playlist;
}

export type PlaylistActionTypes =
  | AddPlaylistAction
  | DeleteAllPlaylistsAction
  | SelectPlaylistAction;
export const addPlaylist = (playlist: Playlist): PlaylistActionTypes => {
  return {
    type: ADD_PLAYLIST,
    payload: playlist,
  };
};

export const deleteAllPlaylists = (): PlaylistActionTypes => {
  return {
    type: DELETE_ALL_PLAYLISTS,
  };
};

export const selectPlaylist = (playlist: Playlist): PlaylistActionTypes => {
  return {
    type: SELECT_PLAYLIST,
    payload: playlist,
  };
};
