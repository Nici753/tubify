import { Playlist } from '../types/Playlist.ts';
import { Track, YouTubeTrackResponse } from '../types/Track.ts';
import useUserStore from '../store/user-store.ts';
import { toast } from 'sonner';

export interface YoutubeAPIInterface {}

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
  nextPageToken: string | undefined;
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

  private constructor() {}

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
    const search_url: string = `?part=snippet&maxResults=1&type=video&q=${query}`;

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
      // TODO: Make better or remove
      /*toast.error('Failed to search for track on Youtube: ' + track.name, {
        description: (e as Error).message,
      });*/
    }
    return track;
  }

  async updatePlaylist(playlist: Playlist): Promise<Playlist> {
    const newPlaylist: Playlist = structuredClone(playlist);
    // TODO: Make better
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
    // TODO: Make better
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
        description:
          'Not all songs have a YoutubeId! Please update playlist first.',
      });
      return newPlaylist;
    }
    // Gard clause: Playlist does not have a YoutubeId yet -> first create playlist on YouTube, then add songs
    if (!newPlaylist.YoutubeId) {
      newPlaylist.YoutubeId = await this.exportNewPlaylist(newPlaylist);
    } else {
      await this.addingMissingSongsToPlaylist(newPlaylist);
    }
    return newPlaylist;
  }

    private async addingMissingSongsToPlaylist(newPlaylist: Playlist): Promise<void> {
    const stillMissingTracks: Playlist = structuredClone(newPlaylist);

    // Create a set to store ALL video IDs found in the YouTube playlist
    const songsInPlaylist = new Set<string>();
    let nextPageToken: string | undefined = undefined;

    // Loop until there are no more pages
    do {
      // Construct the URL with the pageToken if we have one
      const pageParam : string = nextPageToken ? `&pageToken=${nextPageToken}` : '';
      const endpoint = `/playlistItems?part=snippet&playlistId=${newPlaylist.YoutubeId}&maxResults=50${pageParam}`;

      const response: Response = await this.youtubeGetRequest(endpoint);
      const data: YoutubePlaylistResponse = await response.json();

      // Add this page's items to our collection
      data.items.forEach((item) => {
        songsInPlaylist.add(item.snippet.resourceId.videoId);
      });

      // Update the token for the next iteration
      nextPageToken = data.nextPageToken;

    } while (nextPageToken); // If this is undefined/null, the loop stops

    // Filter the local tracks
    stillMissingTracks.tracks = (stillMissingTracks.tracks ?? [])
      .filter((song) => song.YoutubeId !== undefined)
      .filter((song) => !songsInPlaylist.has(song.YoutubeId!));

    // Export only if there's actually something new to add
    if (stillMissingTracks.tracks.length > 0) {
      // TODO: Make better
      toast.info(`Adding ${stillMissingTracks.tracks.length} new songs to YouTube playlist`);
      await this.exportTracks(stillMissingTracks);
    } else {
      // TODO: Make better
      toast.success('Playlist is already up to date!');
    }
  }

  private async exportNewPlaylist(newPlaylist: Playlist): Promise<string> {
    const response: Response = await this.youtubePostRequest(
      '/playlists?part=snippet',
      {
        snippet: {
          title: newPlaylist.name,
        },
      },
    );

    const data: { id: string } = await response.json();
    // TODO: Make better
    toast.info('Created new playlist on YouTube');

    // TODO: Make better
    toast.info('Adding songs to YouTube playlist');
    newPlaylist.YoutubeId = data.id;
    await this.exportTracks(newPlaylist);

    return data.id;
  }

  private async exportTracks(newPlaylist: Playlist) : Promise<void> {
    type TrackWithId = Track & { YoutubeId: string }; //override properties of track interface
    type PlaylistWithId = Playlist & { YoutubeId: string }; //override properties of track interface
    const playlistHasId = (item: Playlist): item is PlaylistWithId =>
      'YoutubeId' in item; //Predicate to tell that tracks have an id

    if (!playlistHasId(newPlaylist)) {

      console.error('Playlist has no YouTubeId');
      // TODO: Make better
      toast.error('Playlist has no YouTubeId', {});
      return;
    }
    // TODO: Make better
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
        // TODO: Make better
        /*toast.error(
          'Failed to add song to YouTube playlist: ' + song.YoutubeId,
          {
            description: e instanceof Error ? e.message: + 'could not add song to playlist',
          },
        );*/
      }
    }
    toast.success('Playlists export finished');
  }
}
