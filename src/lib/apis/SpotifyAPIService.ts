import { Playlist, SpotifyPlaylistResponse } from '../types/Playlist.ts';
import { Track, SpotifyTrackResponse } from '../types/Track.ts';
import useUserStore from '../store/user-store.ts';
import { toast } from 'sonner';

export interface SpotifyAPIInterface {
  fetchFromSpotify(endpoint: string): Promise<Response>;

  getUserName(): Promise<string>;

  importPlaylist(importedPlaylists: Playlist[]): void;

  getAllUsersPlaylist(importedPlaylists: Playlist[]): Promise<Playlist[]>;

  getPlaylistItems(playlistId: string | undefined): Promise<Track[]>;
}

export class SpotifyAPIService implements SpotifyAPIInterface {

  private static instance: SpotifyAPIService;

  private constructor() {
  }

  public static getInstance(): SpotifyAPIService {
    if (!SpotifyAPIService.instance) {
      SpotifyAPIService.instance = new SpotifyAPIService();
    }
    return SpotifyAPIService.instance;
  }

  spotifyToken = useUserStore((state) => state.spotify_access_token);
  baseURL: string = 'https://api.spotify.com/v1';

  async fetchFromSpotify(requestURL: string): Promise<Response> {
    if (this.spotifyToken == null) {
      throw new Error('No access token found');
    } else {
      const request = new Request(`${requestURL}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.spotifyToken}`,
        },
      });
      return await fetch(request);
    }
  }

  async getAllUsersPlaylist(importedPlaylists: Playlist[]) {
    try {
      const user_display_name: string = await this.getUserName();
      let data: {
        next: string;
        items: SpotifyPlaylistResponse[];
      } = {
        next: `${this.baseURL}/me/playlists`,
        items: [],
      };
      // Handle Spotify pagination issues (last playlist is first on the next page)
      const spotifyPlaylistIds: string[] = [];
      for (const playlist of importedPlaylists) {
        spotifyPlaylistIds.push(playlist.SpotifyId);
      }
      // handling spotify pagination
      let playlists: Playlist[] = [];
      do {
        const response = await this.fetchFromSpotify(data.next);
        data = await response.json();
        const playlist: Playlist[] = data.items
          .filter((item) => {
            // Handle Spotify pagination issues (last playlist is first on the next page)
            const checkItem =
              item.owner.display_name === user_display_name &&
              !spotifyPlaylistIds.includes(item.id);
            spotifyPlaylistIds.push(item.id);
            return checkItem;
          })
          .map((item) => ({
            SpotifyId: item.id,
            name: item.name,
            imageUrl: item.images[0]?.url,
            SpotifyUrl: item.external_urls.spotify,
          }));
        playlists = [...playlists, ...playlist];
      } while (data.next);
      const numberOfPlaylistsToImport = playlists.length;
      let numberOfImportedPlaylists = 0;

      toast.info('Importing Playlists', {
        description: numberOfImportedPlaylists + ' of ' + numberOfPlaylistsToImport,
      });
      for (const playlist of playlists) {
        await this.delay(1000);
        playlist.tracks = await this.getPlaylistItems(playlist.SpotifyId);
        numberOfImportedPlaylists++;
        toast.info('Importing Playlists', {
          description: numberOfImportedPlaylists + ' of ' + numberOfPlaylistsToImport,
        });
        if (numberOfImportedPlaylists === numberOfPlaylistsToImport) {
          toast.success('Importing Playlists', {
            description: 'All Playlists successfully imported',
          });
        }
      }

      return playlists;
    } catch (error) {
      console.error('Error fetching user playlists:', error);
      toast.error('Error fetching user playlists:', {
        description: error.message,
      });
      return [] as Playlist[];
    }
  }

  async getPlaylistItems(playlistId: string): Promise<Track[]> {
    let data: {
      next: string;
      items: SpotifyTrackResponse[];
    } = { next: `${this.baseURL}/playlists/${playlistId}/tracks`, items: [] };

    let songs: Track[] = [];
    // handling spotify pagination
    do {
      const response = await this.fetchFromSpotify(data.next);
      data = await response.json();
      const newSongs: Track[] = data.items.map((item) => ({
        SpotifyId: item.track.id,
        name: item.track.name,
        imageUrl: item.track.album.images[0]?.url,
        SpotifyUrl: item.track.external_urls.spotify,
        artists: item.track.artists.map((artist) => artist.name),
      }));
      songs = [...songs, ...newSongs];
    } while (data.next);
    return songs;
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getUserName(): Promise<string> {
    const response = await this.fetchFromSpotify(`${this.baseURL}/me`);
    const data = await response.json();
    return data.display_name;
  }

  async importPlaylist(importedPlaylists: Playlist[]) {
    return await this.getAllUsersPlaylist(importedPlaylists);
  }
}
