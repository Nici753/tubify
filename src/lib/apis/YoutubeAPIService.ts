import { Playlist } from '../types/Playlist.ts';

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

  async searchSongOnYoutube(querry: string): Promise<Response> {}

  async updatePlaylist(playlist: Playlist): Promise<Playlist> {
    console.log(playlist);
    return playlist;
  }
}
