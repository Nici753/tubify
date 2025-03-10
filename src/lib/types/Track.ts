type Track = {
  SpotifyId: string;
  YoutubeId?: string;
  name: string;
  imageUrl: string;
  SpotifyUrl: string;
  YoutubeUrl?: string;
  artists: Array<string>;
};

export type SpotifyTrackResponse = {
  track: {
    id: string;
    name: string;
    album: {
      images: {
        url: string;
      }[];
    };
    external_urls: {
      spotify: string;
    };
    artists: {
      name: string;
    }[];
  };
};

export type YouTubeTrackResponse = {
  items: {
    id: {
      videoId: string;
    };
  }[];
};

export type { Track };
