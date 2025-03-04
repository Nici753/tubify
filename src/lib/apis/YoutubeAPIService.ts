import { Playlist, YoutubePlaylistResponse } from '../types/Playlist.ts';
import { Track, YouTubeTrackResponse } from '../types/Track.ts';
import useUserStore from '../store/user-store.ts';

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

  youtubeToken = useUserStore(state => state.youtube_access_token);

  async youtubeGetRequest(endpoint: string): Promise<Response> {
    const request: Request = new Request(
      `https://www.googleapis.com/youtube/v3${endpoint}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.youtubeToken}`,
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
          Authorization: `Bearer ${this.youtubeToken}`,
        },
        body: JSON.stringify(body),
      },
    );
    return await fetch(request);
  }

  async searchSongOnYoutube(track: Track): Promise<Track> {
    const query: string = `${track.name} ${track.artists.join(', ')}`;
    const search_url: string = `?part=snippet&maxResults=1&q=${query}`;

    try {
      const response: Response = await this.youtubeGetRequest(
        `/search/${search_url}`,
      );
      const data: YouTubeTrackResponse = await response.json();
      if (data.items.length > 0) {
        track.YoutubeId = data.items[0].id.videoId;
        track.YoutubeUrl = `https://www.youtube.com/watch?v=${track.YoutubeId}`;
      }
    } catch (e) {
      console.error('Failed to search for track on Youtube: ' + track.name + ', Error: ' + e);
    }
    return track;
  }

  async updatePlaylist(playlist: Playlist): Promise<Playlist> {
    playlist.tracks?.forEach((track) => {
      if (!track.YoutubeId) {
        const youtubeSong = this.searchSongOnYoutube(track);
        if (youtubeSong.YoutubeId) {
          track.YoutubeId = youtubeSong.YoutubeId;
          track.YoutubeUrl = youtubeSong.YoutubeUrl;
        }
      }
    });
    return playlist;
  }

  async exportPlaylist(playlistToExport: Playlist): Promise<Playlist> {
    // Gard clause: All tracks in playlist must have a YoutubeId
    if (!playlistToExport.tracks?.every((song) => song.YoutubeId)) {
      console.error('Not all songs have a YoutubeId');
      return playlistToExport;
    } else {
      const isNewYoutubePlaylist: boolean = !playlistToExport.YoutubeId;
      let songsToExport: Track[] = playlistToExport.tracks;
      // Gard clause: Playlist does not have a YoutubeId yet -> first create playlist on YouTube, then add songs
      if (!playlistToExport.YoutubeId) {
        const response: Response = await this.youtubePostRequest(
          '/playlists?part=snippet',
          {
            snippet: {
              title: playlistToExport.name,
            },
          },
        );

        const data: JSON = await response.json();
        playlistToExport.YoutubeId = data.id;
      }
      // Gard clause: Playlist already exists on YouTube -> get all songs in playlist and remove them from songs to export
      if (!isNewYoutubePlaylist) {
        const response: Response = await this.youtubeGetRequest(
          `/playlistItems?part=snippet&playlistId=${playlistToExport.YoutubeId}`,
        );
        const data: JSON = await response.json();
        const songsInPlaylist: Array<string> = await data.items.map((item) => item.snippet.resourceId.videoId);
        // Remove songs that are already in the playlist form songs to export
        songsToExport = songsToExport.filter((song) => !songsInPlaylist.includes(song.YoutubeId));
      }
      // Add songs to playlist
      for (const song of songsToExport) {
        try {
          await this.youtubePostRequest(
            '/playlistItems?part=snippet',
            {
              snippet: {
                playlistId: playlistToExport.YoutubeId,
                resourceId: {
                  kind: 'youtube#video',
                  videoId: song.YoutubeId,
                },
              },
            },
          );
        } catch (e) {
          console.error('Failed to add song to Youtube playlist: ' + song.YoutubeId + ', Error: ' + e);
        }
      }
      return playlistToExport;
    }
  }
}
