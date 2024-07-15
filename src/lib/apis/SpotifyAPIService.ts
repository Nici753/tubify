import { Playlist } from '../types/Playlist.ts';
import { Song } from '../types/Song.ts';

export interface SpotifyAPIInterface {
  fetchFromSpotify(endpoint: string): Promise<Response>;
  getUserName(): void;
  importPlaylist(): void;
  getAllUsersPlaylist(): Promise<Playlist[]>;
  getPlaylistItems(playlistId: string): Promise<Song[]>;
}

export class SpotifyAPIService implements SpotifyAPIInterface {

  private static instance: SpotifyAPIService;
  private constructor() {}
  public static getInstance(): SpotifyAPIService {
    if (!SpotifyAPIService.instance) {
      SpotifyAPIService.instance = new SpotifyAPIService();
    }
    return SpotifyAPIService.instance;
  }

  async fetchFromSpotify(endpoint: string): Promise<Response> {
    if (!localStorage.getItem('spotify_access_token')) {
      throw new Error('No access token found');
    } else {
      const request = new Request(
        `https://api.spotify.com/v1${endpoint}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('spotify_access_token')}`,
          },
        },
      );
      return await fetch(request);
    }
  }

  async getAllUsersPlaylist(): Promise<Playlist[]> {
    try {
      let response = await this.fetchFromSpotify('/me/playlists');
      let data = await response.json();

      // Save data.items to an array of type Playlist
      let playlists: Playlist[] = data.items.map((item) => ({
        SpotifyId: item.id,
        name: item.name,
        imageUrl: item.images[0]?.url,
        SpotifyUrl: item.external_urls.spotify,
      }));

      // Make a while loop to get the next and add the new data.items to the array
      while (data.next) {
        response = await this.fetchFromSpotify(data.next);
        data = await response.json();
        const newPlaylists: Playlist[] = data.items.map((item) => ({
          SpotifyId: item.id,
          name: item.name,
          imageUrl: item.images[0]?.url,
          SpotifyUrl: item.external_urls.spotify,
        }));
        playlists = [...playlists, ...newPlaylists];
      }

      return playlists;
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  }

  getPlaylistItems(playlistId: string): Promise<Song[]> {
    return Promise.resolve([]);
  }

  getUserName(): void {
    this.fetchFromSpotify('/me').then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data.display_name);
          localStorage.setItem('user_name', data.display_name);
        });
      }
    });
  }

  async importPlaylist() {
    this.getUserName();
    const playlists: Playlist[] = await this.getAllUsersPlaylist();
    console.log(playlists);
  }
}
