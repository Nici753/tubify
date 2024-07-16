import { Playlist } from '../types/Playlist';


export const ADD_PLAYLIST = 'ADD_PLAYLIST';
export const DELETE_ALL_PLAYLISTS = 'DELETE_ALL_PLAYLISTS';

interface AddPlaylistAction {
  type: typeof ADD_PLAYLIST;
  payload: Playlist;
}

interface DeleteAllPlaylistsAction {
  type: typeof DELETE_ALL_PLAYLISTS;
}

export type PlaylistActionTypes = AddPlaylistAction | DeleteAllPlaylistsAction;

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

