import { Song } from './Song';

export type Playlist = {
  SpotifyId?: string;
  YoutubeId?: string;
  name: string;
  imageUrl?: string;
  SpotifyUrl?: string;
  YoutubeUrl?: string;
  tracks?: Array<Song>;
};

export type PlaylistState = {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;
};

export const initialState: PlaylistState = {
  playlists: [],
  selectedPlaylist: null,
};
