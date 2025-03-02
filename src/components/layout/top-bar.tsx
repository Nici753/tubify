import { ModeToggle } from "./mode-toggle.tsx";
import { YoutubeLoginButton } from "../login/youtube-login-button.tsx";
import { SpotifyLoginButton } from "../login/spotify-login-button.tsx";
import { LogoutButton } from "../login/logout-button.tsx";
import { NameTag } from "./name-tag.tsx";
import { useEffect } from "react";
import { ExImportButton } from "../playlists/ex-import-button.tsx";
import useUserStore from "../../lib/store/user-store.ts"; // Import Zustand store

export function TopBar() {
  const {
    youtube_access_token,
    spotify_access_token,
    user_name,
    setSpotifyToken,
  } = useUserStore();

  const youtubeLoggedIn = !!youtube_access_token;
  const spotifyLoggedIn = !!spotify_access_token;

  useEffect(() => {
    if (window.location.hash) {
      const accessToken = getAccessTokenFromUrl();
      if (accessToken) {
        setSpotifyToken(accessToken); // Store in Zustand instead of localStorage
        window.location.href = "/";
      }
    }
  }, []);

  function getAccessTokenFromUrl(): string | null {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce(function (initial: Record<string, string>, item: string) {
        const parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});
    window.location.hash = ""; // Clear the hash
    return hash.access_token;
  }

  return (
    <div className="flex flex-row-reverse p-3 border-b-4">
      <ModeToggle />
      {/*{spotifyLoggedIn && youtubeLoggedIn && <ExImportButton />}*/}
      {!spotifyLoggedIn && <SpotifyLoginButton />}
      {!youtubeLoggedIn && <YoutubeLoginButton />}
      {youtubeLoggedIn && <LogoutButton />}
      <div className="flex-auto content-center">
        {user_name && <NameTag />}
      </div>
    </div>
  );
}

export default TopBar;
