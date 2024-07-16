import { Playlist } from '../types/Playlist.ts';
import { Song } from '../types/Song.ts';

export interface SpotifyAPIInterface {
  fetchFromSpotify(endpoint: string): Promise<Response>;
  getUserName(): Promise<string>;
  importPlaylist(): void;
  getAllUsersPlaylist(): Promise<Playlist[]>;

  getPlaylistItems(playlistId: string | undefined): Promise<Song[]>;
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
      const request = new Request(`https://api.spotify.com/v1${endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('spotify_access_token')}`,
        },
      });
      return await fetch(request);
    }
  }

  async getAllUsersPlaylist(): Promise<Playlist[]> {
    try {
      const user_display_name: string = await this.getUserName();
      let response: Response = await this.fetchFromSpotify('/me/playlists');
      let data = await response.json();

      // Save data.items to an array of type Playlist, filtering out playlists not owned by the user
      let playlists: Playlist[] = data.items
        .filter((item) => item.owner.display_name === user_display_name) // Replace 'your_user_id' with the actual user ID
        .map((item) => ({
          SpotifyId: item.id,
          name: item.name,
          imageUrl: item.images[0]?.url,
          SpotifyUrl: item.external_urls.spotify,
        }));

      // Make a while loop to get the next and add the new data.items to the array
      while (data.next) {
        response = await this.fetchFromSpotify(data.next);
        data = await response.json();
        const newPlaylists: Playlist[] = data.items
          .filter((item) => item.owner.display_name === user_display_name) // Replace 'your_user_id' with the actual user ID
          .map((item) => ({
            SpotifyId: item.id,
            name: item.name,
            imageUrl: item.images[0]?.url,
            SpotifyUrl: item.external_urls.spotify,
          }));
        playlists = [...playlists, ...newPlaylists];
      }

      console.log('Loading ' + playlists.length + ' playlists');
      let currentPlaylist = 0;

      for (const playlist of playlists) {
        console.log('Loading playlist ' + playlist.name + '...');
        await this.delay(1000);
        playlist.tracks = await this.getPlaylistItems(playlist.SpotifyId);
        currentPlaylist++;
        console.log('Loaded ' + currentPlaylist + ' Playlists');
      }

      console.log('Finished loading playlists');

      return playlists;
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  }

  async getPlaylistItems(playlistId: string | undefined): Promise<Song[]> {
    let response: Response = await this.fetchFromSpotify(
      `/playlists/${playlistId}/tracks`,
    );
    let data = await response.json();

    let songs: Song[] = data.items.map((item) => ({
      SpotifyId: item.track.id,
      name: item.track.name,
      imageUrl: item.track.album.images[0]?.url,
      SpotifyUrl: item.track.external_urls.spotify,
      artists: item.track.artists.map((artist) => artist.name),
    }));

    // Make a while loop to get the next and add the new data.items to the array
    while (data.next) {
      response = await this.fetchFromSpotify(data.next);
      data = await response.json();
      const newSongs: Song[] = data.tracks.items.map((item) => ({
        SpotifyId: item.track.id,
        name: item.track.name,
        imageUrl: item.track.album.images[0]?.url,
        SpotifyUrl: item.track.external_urls.spotify,
        artists: item.track.artists.map((artist) => artist.name),
      }));
      songs = [...songs, ...newSongs];
    }
    return songs;
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getUserName(): Promise<string> {
    const response = await this.fetchFromSpotify('/me');
    const data = await response.json();
    return data.display_name;
  }

  async importPlaylist() {
    const playlists: Playlist[] = await this.getAllUsersPlaylist();
  }
}
