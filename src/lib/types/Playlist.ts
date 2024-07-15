import { Song } from 'Song.ts';

type Playlist = {
  SpotifyId?: string;
  YoutubeId?: string;
  name: string;
  imageUrl?: string;
  SpotifyUrl?: string;
  YoutubeUrl?: string;
  tracks?: Array<Song>;
};

export type { Playlist };
