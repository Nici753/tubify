import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  spotify_access_token: string | null;
  spotify_refresh_token: string | null;
  spotify_token_expiry: string | null;
  youtube_access_token: string | null;
  user_name: string | null;
  user_email: string | null;
  user_picture: string | null;

  setSpotifyToken: (token: string) => void;
  setSpotifyRefreshToken: (token: string) => void;
  setSpotifyTokenExpiry: (token: string) => void;
  setYouTubeToken: (token: string) => void;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setUserPicture: (picture: string) => void;

  clearUser: () => void;
  clearSpotify: () => void;
  clearYouTube: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      spotify_access_token: null,
      spotify_refresh_token: null,
      spotify_token_expiry: null,
      youtube_access_token: null,
      user_name: null,
      user_email: null,
      user_picture: null,

      setSpotifyToken: (token) => set({ spotify_access_token: token }),
      setSpotifyRefreshToken: (token) => set({ spotify_refresh_token: token }),
      setSpotifyTokenExpiry: (token) => set({ spotify_token_expiry: token }),
      setYouTubeToken: (token) => set({ youtube_access_token: token }),
      setUserName: (name) => set({ user_name: name }),
      setUserEmail: (email) => set({ user_email: email }),
      setUserPicture: (picture) => set({ user_picture: picture }),

      clearUser: () =>
        set({
          spotify_access_token: null,
          spotify_refresh_token: null,
          spotify_token_expiry: null,
          youtube_access_token: null,
          user_name: null,
          user_email: null,
          user_picture: null,
        }),

      clearSpotify: () =>
        set({
          spotify_access_token: null,
          spotify_refresh_token: null,
          spotify_token_expiry: null,
        }),

      clearYouTube: () =>
        set({
          youtube_access_token: null,
          user_name: null,
          user_email: null,
          user_picture: null,
        }),
    }),
    { name: 'user-data' }, // Key for localStorage
  ),
);

export default useUserStore;
