import { Playlist } from '../types/Playlist.ts';
import { Song } from '../types/Song.ts';

export interface YoutubeAPIInterface {
}

export class YoutubeAPIService implements YoutubeAPIInterface {
  private static instance: YoutubeAPIService;

  private constructor() {
  }

  public static getInstance(): YoutubeAPIService {
    if (!YoutubeAPIService.instance) {
      YoutubeAPIService.instance = new YoutubeAPIService();
    }
    return YoutubeAPIService.instance;
  }

  async youtubeGetRequest(endpoint: string): Promise<Response> {
    const request: Request = new Request(
      `https://www.googleapis.com/youtube/v3${endpoint}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('youtube_access_token')}`,
        },
      },
    );
    return await fetch(request);
  }

  async youtubePostRequest(endpoint: string, body: JSON): Promise<Response> {
    const request: Request = new Request(
      `https://www.googleapis.com/youtube/v3${endpoint}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('youtube_access_token')}`,
        },
        body: JSON.stringify(body),
      },
    );
    return await fetch(request);
  }

  async searchSongOnYoutube(song: Song): Promise<Song> {
    const query: string = `${song.name} ${song.artists.join(', ')}`;
    const search_url: string = `?part=snippet&maxResults=1&q=${query}`;

    const response: Response = await this.youtubeGetRequest(
      `/search/${search_url}`,
    );
    const data: JSON = await response.json();
    console.log(data);
    if (data.items.length > 0) {
      song.YoutubeId = data.items[0].id.videoId;
      song.YoutubeUrl = `https://www.youtube.com/watch?v=${song.YoutubeId}`;
    }
    console.log(song);
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
    console.log(playlist);
    return playlist;
  }

  async exportPlaylist(playlistToExport: Playlist): Promise<Playlist> {
    // Gard clause: All tracks in playlist must have a YoutubeId
    if (!playlistToExport.tracks?.every((song) => song.YoutubeId)) {
      console.error('Not all songs have a YoutubeId');
      return playlistToExport;
    }
    else {
      const isNewYoutubePlaylist: boolean = !playlistToExport.YoutubeId;
      // Gard clause: Playlist does not have a YoutubeId yet -> first create playlist on YouTube, then add songs
      if (!playlistToExport.YoutubeId) {
        console.log('Playlist created on YoutubeId');
        //TODO: Create playlist on YouTube
        const response: Response = await this.youtubePostRequest(
          '/playlists?part=snippet',
          {
            snippet: {
              title: playlistToExport.name,
            },
          },
        );

        const data: JSON = await response.json();
        console.log(data);
        playlistToExport.YoutubeId = data.id;
      }
      //TODO: if not new playlist, check what songs are already in the playlist
      if (!isNewYoutubePlaylist) {
        const response: Response = await this.youtubeGetRequest(
          `/playlistItems?part=snippet&playlistId=${playlistToExport.YoutubeId}`,
        );
        const data: JSON = await response.json();
        console.log(data);
      }

      //TODO: Try and add as many songs as possible to YouTube playlist

      console.log('Exporting playlist to Youtube: ' + await playlistToExport.json());
      return playlistToExport;
    }
  }
}
