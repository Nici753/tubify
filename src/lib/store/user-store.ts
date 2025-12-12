import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  spotify_access_token: string | null;
  youtube_access_token: string | null;
  user_name: string | null;
  user_email: string | null;
  user_picture: string | null;

  setSpotifyToken: (token: string) => void;
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
      youtube_access_token: null,
      user_name: null,
      user_email: null,
      user_picture: null,

      setSpotifyToken: (token) => set({ spotify_access_token: token }),
      setYouTubeToken: (token) => set({ youtube_access_token: token }),
      setUserName: (name) => set({ user_name: name }),
      setUserEmail: (email) => set({ user_email: email }),
      setUserPicture: (picture) => set({ user_picture: picture }),

      clearUser: () =>
        set({
          spotify_access_token: null,
          youtube_access_token: null,
          user_name: null,
          user_email: null,
          user_picture: null,
        }),

      clearSpotify: () =>
        set({
          spotify_access_token: null,
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
