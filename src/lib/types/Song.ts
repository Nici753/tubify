type Song = {
  SpotifyId?: string;
  YoutubeId?: string;
  name: string;
  imageUrl?: string;
  SpotifyUrl?: string;
  YoutubeUrl?: string;
  artists?: Array<string>;
};

export type { Song };
