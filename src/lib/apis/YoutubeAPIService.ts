import { Playlist } from '../types/Playlist.ts';
import { Track, YouTubeTrackResponse } from '../types/Track.ts';
import useUserStore from '../store/user-store.ts';
import { toast } from 'sonner';

export interface YoutubeAPIInterface {
}

type YoutubePostRequest = {
  snippet: {
    playlistId: string;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
};

type YoutubePlaylistPostUpdateTitle = {
  snippet: {
    title: string;
  };
};

type YoutubePlaylistResponse = {
  items: {
    snippet: {
      resourceId: {
        videoId: string;
      };
    };
  }[];
};

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

  youtubeToken = useUserStore((state) => state.youtube_access_token);

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

  async youtubePostRequest(
    endpoint: string,
    body: YoutubePostRequest | YoutubePlaylistPostUpdateTitle,
  ): Promise<Response> {
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
      console.error(
        'Failed to search for track on Youtube: ' +
        track.name +
        ', Error: ' +
        e,
      );
      toast.error('Failed to search for track on Youtube: ' +
        track.name, {
        description: e.message,
      });
    }
    return track;
  }

  async updatePlaylist(playlist: Playlist): Promise<Playlist> {
    const newPlaylist: Playlist = structuredClone(playlist);
    toast.info('Updating playlist');
    for (const track of newPlaylist.tracks || []) {
      if (!track.YoutubeId) {
        const youtubeSong = await this.searchSongOnYoutube(track);
        if (youtubeSong.YoutubeId) {
          track.YoutubeId = youtubeSong.YoutubeId;
          track.YoutubeUrl = youtubeSong.YoutubeUrl;
        }
      }
    }
    toast.success('Playlists update finished');
    return newPlaylist;
  }

  async exportPlaylist(playlistToExport: Playlist): Promise<Playlist> {
    const newPlaylist: Playlist = structuredClone(playlistToExport);

    type TrackWithId = Track & { YoutubeId: string }; //override properties of track interface
    const hasId = (item: Track): item is TrackWithId => 'YoutubeId' in item; //Predicate to tell that tracks have an id

    // Guard clause: All tracks in playlist must have a YoutubeId
    if (!newPlaylist.tracks?.every(hasId)) {
      console.error('Not all songs have a YoutubeId');
      toast.error('Cannot export this Playlist', {
        description: 'Not all songs have a YoutubeId! Please update playlist first.',
      });
      return newPlaylist;
    }
    const isNewYoutubePlaylist: boolean = !newPlaylist.YoutubeId;
    // Gard clause: Playlist does not have a YoutubeId yet -> first create playlist on YouTube, then add songs
    if (!newPlaylist.YoutubeId) {
      const response: Response = await this.youtubePostRequest(
        '/playlists?part=snippet',
        {
          snippet: {
            title: newPlaylist.name,
          },
        },
      );

      const data: { id: string } = await response.json();
      newPlaylist.YoutubeId = data.id;
      toast.info('Created new playlist on YouTube')
    }
    // Gard clause: Playlist already exists on YouTube -> get all songs in playlist and remove them from songs to export
    if (!isNewYoutubePlaylist) {
      toast.info('Adding songs to YouTube playlist');
      const response: Response = await this.youtubeGetRequest(
        `/playlistItems?part=snippet&playlistId=${newPlaylist.YoutubeId}`,
      );
      const data: YoutubePlaylistResponse = await response.json();
      const songsInPlaylist: Array<string> = data.items.map(
        (item) => item.snippet.resourceId.videoId,
      );
      // Remove songs that are already in the playlist form songs to export
      newPlaylist.tracks = newPlaylist.tracks.filter(
        (song) => !songsInPlaylist.includes(song.YoutubeId),
      );
    }

    type PlaylistWithId = Playlist & { YoutubeId: string }; //override properties of track interface
    const playlistHasId = (item: Playlist): item is PlaylistWithId =>
      'YoutubeId' in item; //Predicate to tell that tracks have an id

    if (!playlistHasId(newPlaylist)) {
      console.error('Playlist has no YouTubeId');
      toast.error('Playlist has no YouTubeId', {
      });
      return newPlaylist;
    }
    toast.info('Adding songs to YouTube playlist');
    // Add songs to playlist
    for (const song of newPlaylist.tracks as TrackWithId[]) {
      try {
        await this.youtubePostRequest('/playlistItems?part=snippet', {
          snippet: {
            playlistId: newPlaylist.YoutubeId,
            resourceId: {
              kind: 'youtube#video',
              videoId: song.YoutubeId,
            },
          },
        });
      } catch (e) {
        console.error(
          'Failed to add song to YouTube playlist: ' +
          song.YoutubeId +
          ', Error: ' +
          e,
        );
        toast.error('Failed to add song to YouTube playlist: ' +
          song.YoutubeId, {
          description: e.message,
        });
      }
    }
    toast.success('Playlists export finished');
    return newPlaylist;
  }
}
