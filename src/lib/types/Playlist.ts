import { Song } from './Song';

export type Playlist = {
  SpotifyId: string;
  YoutubeId?: string;
  name: string;
  imageUrl: string;
  SpotifyUrl: string;
  YoutubeUrl?: string;
  tracks?: Array<Song>;
};

export type PlaylistResponse = {
  id: string;
  name: string;
  images: {
    url: string;
  }[];
  owner: {display_name: string};
  external_urls: {
    spotify: string;
  }
}

export type PlaylistState = {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;
};
