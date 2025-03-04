import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Playlist } from "../types/Playlist.ts";

interface PlaylistState {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;

  addPlaylist: (playlist: Playlist) => void;
  updatePlaylist: (updatedPlaylist: Playlist) => void;
  removePlaylist: (playlistId: string) => void;
  selectPlaylist: (playlistId: string) => void;
  clearPlaylists: () => void;
}

const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],
      selectedPlaylist: null,

      addPlaylist: (playlist) => {
        set({ playlists: [...get().playlists, playlist] });
      },

      updatePlaylist: (updatedPlaylist) => {
        set({
          playlists: get().playlists.map((p) =>
            p.SpotifyId === updatedPlaylist.SpotifyId
              ? updatedPlaylist
              : p
          ),
        });
      },

      removePlaylist: (playlistId) => {
        set({
          playlists: get().playlists.filter(
            (p) => p.SpotifyId !== playlistId && p.YoutubeId !== playlistId
          ),
        });
      },

      selectPlaylist: (playlistId) => {
        const playlist = get().playlists.find(
          (p) => p.SpotifyId === playlistId
        );
        set({ selectedPlaylist: playlist || null });
      },

      clearPlaylists: () => {
        set({ playlists: [], selectedPlaylist: null });
        localStorage.removeItem("playlists-data"); // Clear localStorage
      },
    }),
    { name: "playlists-data" } // Key for localStorage
  )
);

export default usePlaylistStore;
