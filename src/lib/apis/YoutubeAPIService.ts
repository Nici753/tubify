import { Playlist } from '../types/Playlist.ts';
import { Song } from '../types/Song.ts';

export interface YoutubeAPIInterface {}

export class YoutubeAPIService implements YoutubeAPIInterface {
  private static instance: YoutubeAPIService;

  private constructor() {}

  public static getInstance(): YoutubeAPIService {
    if (!YoutubeAPIService.instance) {
      YoutubeAPIService.instance = new YoutubeAPIService();
    }
    return YoutubeAPIService.instance;
  }

  async youtubeRequest(endpoint: string, method: string): Promise<Response> {
    const request: Request = new Request(
      `https://www.googleapis.com/youtube/v3${endpoint}`,
      {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('youtube_access_token')}`,
        },
      },
    );
    return await fetch(request);
  }

  async searchSongOnYoutube(song: Song): Promise<Song> {
    const query: string = `${song.name} ${song.artists.join(', ')}`;
    const search_url: string = `?part=snippet&maxResults=1&q=${query}`;

    const response: Response = await this.youtubeRequest(
      `/search/${search_url}`,
      'GET',
    );
    const data: JSON = await response.json();
    if (data.items.length > 0) {
      song.YoutubeId = data.items[0].id.videoId;
      song.YoutubeUrl = `https://www.youtube.com/watch?v=${song.YoutubeId}`;
    }
    return song;
  }

  async updatePlaylist(playlist: Playlist): Promise<Playlist> {
    playlist.tracks?.forEach((song) => {
      const youtubeSong = this.searchSongOnYoutube(song);
      if (youtubeSong.YoutubeId) {
        song.YoutubeId = youtubeSong.YoutubeId;
        song.YoutubeUrl = youtubeSong.YoutubeUrl;
      }
    });

    return playlist;
  }
}
